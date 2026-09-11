"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { StatusPill } from "@/components/shared/status-pill"
import { Modal } from "@/components/shared/modal"
import { DataTable, FilterBar, FilterChip, type Column } from "@/components/shared/data-table"
import { reversePayees, REVERSE_ANNUAL_LIMIT, type ReversePayee } from "@/lib/steel-data"
import { Receipt, ShieldCheck, ShieldAlert, Loader2, FileText, Landmark, UserRound } from "lucide-react"

const yuan = (n: number) => `¥${n.toLocaleString()}`
const wan = (n: number) => `${(n / 10000).toLocaleString(undefined, { maximumFractionDigits: 1 })} 万`

type CheckState =
  | { phase: "idle" }
  | { phase: "checking" }
  | { phase: "pass"; amount: number; remain: number }
  | { phase: "fail"; amount: number; remain: number; over: number }

function usageTone(rate: number): "green" | "amber" | "red" {
  if (rate >= 0.9) return "red"
  if (rate >= 0.6) return "amber"
  return "green"
}

export function FinanceReverse() {
  const [region, setRegion] = useState("全部")
  const [keyword, setKeyword] = useState("")
  const [recordId, setRecordId] = useState<string | null>(null)
  const [issueId, setIssueId] = useState<string | null>(null)
  const [payees, setPayees] = useState<ReversePayee[]>(() => reversePayees.map((p) => ({ ...p, records: [...p.records] })))

  const regions = useMemo(() => ["全部", ...Array.from(new Set(payees.map((p) => p.region)))], [payees])

  const rows = useMemo(
    () =>
      payees.filter((p) => {
        if (region !== "全部" && p.region !== region) return false
        if (keyword && !`${p.name}${p.idNo}${p.id}`.toLowerCase().includes(keyword.toLowerCase())) return false
        return true
      }),
    [region, keyword, payees],
  )

  const stats = useMemo(() => {
    const people = payees.length
    const used = payees.reduce((s, p) => s + p.annualUsed, 0)
    const remain = payees.reduce((s, p) => s + Math.max(0, REVERSE_ANNUAL_LIMIT - p.annualUsed), 0)
    return { people, used, remain }
  }, [payees])

  const recordOf = payees.find((p) => p.id === recordId) ?? null
  const issueOf = payees.find((p) => p.id === issueId) ?? null

  function handleIssue(payeeId: string, amount: number) {
    setPayees((prev) =>
      prev.map((p) => {
        if (p.id !== payeeId) return p
        const seq = p.records.length + 1
        const newRecord = {
          id: `${p.id.replace("ZRR", "FP")}-${String(seq).padStart(3, "0")}`,
          orderId: "手工开具",
          category: "货款",
          qty: "—",
          amount,
          taxRate: "3%",
          issueDate: new Date().toISOString().slice(0, 10),
          status: "已开具" as const,
        }
        return { ...p, annualUsed: p.annualUsed + amount, records: [newRecord, ...p.records] }
      }),
    )
  }

  const cols: Column<ReversePayee>[] = [
    {
      key: "name",
      header: "自然人",
      render: (r) => (
        <span className="inline-flex items-center gap-2 font-medium text-foreground">
          <UserRound className="size-3.5 text-muted-foreground" />
          {r.name}
        </span>
      ),
    },
    { key: "idNo", header: "身份证号（税号）", render: (r) => <span className="tabular-nums text-muted-foreground">{r.idNo}</span> },
    { key: "region", header: "地区" },
    { key: "taxYear", header: "税务年度", render: (r) => <span className="tabular-nums">{r.taxYear}</span> },
    { key: "used", header: "年度已开票", render: (r) => <span className="tabular-nums font-medium text-foreground">{yuan(r.annualUsed)}</span> },
    {
      key: "remain",
      header: "剩余额度",
      render: (r) => {
        const remain = Math.max(0, REVERSE_ANNUAL_LIMIT - r.annualUsed)
        return <span className="tabular-nums font-medium text-primary">{yuan(remain)}</span>
      },
    },
    {
      key: "usage",
      header: "额度使用率",
      render: (r) => {
        const rate = Math.min(1, r.annualUsed / REVERSE_ANNUAL_LIMIT)
        const tone = usageTone(rate)
        const bar = tone === "red" ? "bg-red-500" : tone === "amber" ? "bg-amber-500" : "bg-green-500"
        const text = tone === "red" ? "text-red-600" : tone === "amber" ? "text-amber-600" : "text-green-600"
        return (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
              <div className={`h-full ${bar}`} style={{ width: `${Math.round(rate * 100)}%` }} />
            </div>
            <span className={`tabular-nums text-xs font-medium ${text}`}>{Math.round(rate * 100)}%</span>
          </div>
        )
      },
    },
    {
      key: "op",
      header: "操作",
      render: (r) => (
        <div className="flex items-center gap-1">
          <Button size="sm" onClick={() => setIssueId(r.id)}>
            发起反向开票
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setRecordId(r.id)}>
            开票记录
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="h-full overflow-y-auto p-6">
      <PageHeader title="反向开票" desc="采购方为自然人代开发票，开票前调用国家金税系统校验其年度开票额度（单个自然人不超过 500 万元/年）" />

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={<UserRound className="size-5" />} label="自然人开票对象" value={`${stats.people} 人`} tone="primary" />
        <StatCard icon={<Receipt className="size-5" />} label="本年度已开票合计" value={yuan(stats.used)} tone="amber" />
        <StatCard icon={<ShieldCheck className="size-5" />} label="剩余可开票额度" value={yuan(stats.remain)} tone="green" />
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
        <Landmark className="mt-0.5 size-5 shrink-0 text-primary" />
        <div className="text-sm text-foreground">
          <div className="font-medium">国家金税系统联网校验</div>
          <p className="mt-0.5 text-muted-foreground">
            依据税务规定，自然人年度累计开票额不得超过 500 万元。发起反向开票时，系统将实时调用金税系统校验该自然人本年度剩余额度，超限将自动拦截。
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-card p-4">
        <FilterBar>
          <FilterChip label="地区" value={region} options={regions} onChange={setRegion} />
          <div className="flex-1" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索姓名 / 身份证号"
            className="h-9 w-64 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </FilterBar>
      </div>

      <div className="mt-4 flex items-center">
        <span className="ml-auto text-sm text-muted-foreground">共 {rows.length} 人</span>
      </div>

      <div className="mt-3">
        <DataTable rows={rows} columns={cols} rowKey={(r) => r.id} />
      </div>

      <RecordModal payee={recordOf} onClose={() => setRecordId(null)} />
      <IssueModal payee={issueOf} onClose={() => setIssueId(null)} onIssue={handleIssue} />
    </div>
  )
}

function RecordModal({ payee, onClose }: { payee: ReversePayee | null; onClose: () => void }) {
  const remain = payee ? Math.max(0, REVERSE_ANNUAL_LIMIT - payee.annualUsed) : 0
  return (
    <Modal open={!!payee} onClose={onClose} title={`开票记录 · ${payee?.name ?? ""}`} size="lg">
      {payee && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 rounded-lg border border-border bg-muted/30 p-4 text-sm sm:grid-cols-3">
            <Row k="自然人" v={payee.name} />
            <Row k="身份证号" v={payee.idNo} />
            <Row k="地区" v={payee.region} />
            <Row k="税务年度" v={payee.taxYear} />
            <Row k="年度已开票" v={yuan(payee.annualUsed)} />
            <Row k="剩余额度" v={yuan(remain)} />
          </div>

          {payee.records.length > 0 ? (
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    {["开票单号", "关联订单", "类别", "数量", "开票金��", "税率", "开票日期", "状态"].map((h) => (
                      <th key={h} className="px-3 py-2 text-left font-medium whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payee.records.map((rec) => (
                    <tr key={rec.id} className="border-t border-border">
                      <td className="px-3 py-2 font-medium text-foreground whitespace-nowrap">{rec.id}</td>
                      <td className="px-3 py-2 tabular-nums text-muted-foreground whitespace-nowrap">{rec.orderId}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{rec.category}</td>
                      <td className="px-3 py-2 tabular-nums whitespace-nowrap">{rec.qty}</td>
                      <td className="px-3 py-2 tabular-nums font-medium text-foreground whitespace-nowrap">{yuan(rec.amount)}</td>
                      <td className="px-3 py-2 tabular-nums">{rec.taxRate}</td>
                      <td className="px-3 py-2 tabular-nums whitespace-nowrap">{rec.issueDate}</td>
                      <td className="px-3 py-2">
                        <StatusPill tone={rec.status === "已开具" ? "green" : "muted"} label={rec.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              该自然人本年度暂无反向开票记录
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}

function IssueModal({
  payee,
  onClose,
  onIssue,
}: {
  payee: ReversePayee | null
  onClose: () => void
  onIssue: (payeeId: string, amount: number) => void
}) {
  const [amount, setAmount] = useState("")
  const [check, setCheck] = useState<CheckState>({ phase: "idle" })

  function reset() {
    setAmount("")
    setCheck({ phase: "idle" })
    onClose()
  }

  function confirmIssue() {
    if (payee && check.phase === "pass") {
      onIssue(payee.id, check.amount)
    }
    reset()
  }

  const amountNum = Number(amount.replace(/[^\d.]/g, "")) || 0
  const remain = payee ? Math.max(0, REVERSE_ANNUAL_LIMIT - payee.annualUsed) : 0

  function runCheck() {
    if (!payee || amountNum <= 0) return
    setCheck({ phase: "checking" })
    // 模拟调用国家金税系统联网校验（异步）
    setTimeout(() => {
      const over = payee.annualUsed + amountNum - REVERSE_ANNUAL_LIMIT
      if (over > 0) {
        setCheck({ phase: "fail", amount: amountNum, remain, over })
      } else {
        setCheck({ phase: "pass", amount: amountNum, remain })
      }
    }, 1400)
  }

  return (
    <Modal
      open={!!payee}
      onClose={reset}
      title={`发起反向开票 · ${payee?.name ?? ""}`}
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={reset}>
            取消
          </Button>
          {check.phase === "pass" ? (
            <Button onClick={confirmIssue}>确认开具发票</Button>
          ) : (
            <Button onClick={runCheck} disabled={amountNum <= 0 || check.phase === "checking"}>
              {check.phase === "checking" ? (
                <span className="inline-flex items-center gap-1.5">
                  <Loader2 className="size-4 animate-spin" />
                  校验中
                </span>
              ) : (
                "调用金税系统校验"
              )}
            </Button>
          )}
        </div>
      }
    >
      {payee && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 rounded-lg border border-border bg-muted/30 p-4 text-sm sm:grid-cols-3">
            <Row k="自然人" v={payee.name} />
            <Row k="身份证号" v={payee.idNo} />
            <Row k="收款账户" v={payee.bankAccount} />
            <Row k="税务年度" v={payee.taxYear} />
            <Row k="年度已开票" v={yuan(payee.annualUsed)} />
            <Row k="剩余额度" v={yuan(remain)} />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">本次开票金额（元）</label>
            <input
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                setCheck({ phase: "idle" })
              }}
              inputMode="numeric"
              placeholder="请输入本次反向开票金额"
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
            {amountNum > 0 && (
              <p className="mt-1.5 text-xs text-muted-foreground">
                开票后本年度累计将达 <span className="font-medium text-foreground tabular-nums">{yuan(payee.annualUsed + amountNum)}</span>
                ，年度限额 {wan(REVERSE_ANNUAL_LIMIT)}元。
              </p>
            )}
          </div>

          {check.phase === "checking" && (
            <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-4 text-sm">
              <Loader2 className="size-5 animate-spin text-primary" />
              <div>
                <div className="font-medium text-foreground">正在连接国家金税系统…</div>
                <div className="text-xs text-muted-foreground">校验该自然人 {payee.taxYear} 年度累计开票额度</div>
              </div>
            </div>
          )}

          {check.phase === "pass" && (
            <div className="flex items-start gap-3 rounded-lg border border-green-500/40 bg-green-500/5 p-4">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-green-600" />
              <div className="text-sm">
                <div className="font-medium text-green-700">金税系统校验通过，可开具发票</div>
                <p className="mt-1 text-muted-foreground">
                  本次开票 <span className="font-medium text-foreground tabular-nums">{yuan(check.amount)}</span>，未超过年度 500 万元限额；
                  开票后剩余额度 <span className="font-medium text-foreground tabular-nums">{yuan(check.remain - check.amount)}</span>。
                </p>
              </div>
            </div>
          )}

          {check.phase === "fail" && (
            <div className="flex items-start gap-3 rounded-lg border border-red-500/40 bg-red-500/5 p-4">
              <ShieldAlert className="mt-0.5 size-5 shrink-0 text-red-600" />
              <div className="text-sm">
                <div className="font-medium text-red-700">金税系统校验未通过，开票已拦截</div>
                <p className="mt-1 text-muted-foreground">
                  本次开票 <span className="font-medium text-foreground tabular-nums">{yuan(check.amount)}</span> 将使年度累计
                  超出 500 万元限额 <span className="font-medium text-red-600 tabular-nums">{yuan(check.over)}</span>，
                  当前剩余额度仅 <span className="font-medium text-foreground tabular-nums">{yuan(check.remain)}</span>，请调整开票金额或分年度开具。
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2 rounded-lg border border-border bg-background p-3 text-xs text-muted-foreground">
            <FileText className="mt-0.5 size-4 shrink-0" />
            反向开票由采购方（华东特钢集团）代自然人向税务机关申请代开增值税普通发票，适用征收率 3%，校验通过后同步生成开票记录。
          </div>
        </div>
      )}
    </Modal>
  )
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: string
  tone: "primary" | "green" | "amber"
}) {
  const toneCls =
    tone === "green"
      ? "bg-green-500/10 text-green-600"
      : tone === "amber"
        ? "bg-amber-500/10 text-amber-600"
        : "bg-primary/10 text-primary"
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
      <div className={`flex size-10 items-center justify-center rounded-lg ${toneCls}`}>{icon}</div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="mt-0.5 text-lg font-semibold tabular-nums text-foreground">{value}</div>
      </div>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{k}</span>
      <span className="text-right text-foreground">{v}</span>
    </div>
  )
}
