"use client"

import { useMemo, useState } from "react"
import { Search, RotateCcw, FileSearch, CheckCircle2, XCircle, Info, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { DataTable, FilterBar, FilterChip, type Column } from "@/components/shared/data-table"
import { StatusPill } from "@/components/shared/status-pill"
import { Modal } from "@/components/shared/modal"
import { agreementList, type AgreementItem, type AgreementOrder } from "@/lib/steel-data"

// 供应商视角：本供应商名称（演示固定为一家回收站）
const SELF = "城南再生资源回收站"

// 采购指令单 + 所属协议上下文（供应商视角）
type ConfirmRow = AgreementOrder & {
  agreementId: string
  agreementTitle: string
  buyer: string
  period: string
  priceRule: string
}

const orderTone: Record<AgreementOrder["status"], "amber" | "green" | "red" | "gray"> = {
  待供应商确认: "amber",
  供应商已确认: "green",
  供应商已拒绝: "red",
  已完成: "gray",
}

// 从协议台账中抽取所有指令单（演示：本供应商参与的协议）
function buildRows(): ConfirmRow[] {
  const rows: ConfirmRow[] = []
  for (const a of agreementList) {
    const joined = a.suppliers.some((s) => s.name === SELF)
    if (!joined) continue
    for (const o of a.orders) {
      rows.push({
        ...o,
        agreementId: a.id,
        agreementTitle: a.title,
        buyer: "华东特钢集团",
        period: a.period,
        priceRule: a.price,
      })
    }
  }
  return rows
}

const tabs = ["全部", "待供应商确认", "供应商已确认", "供应商已拒绝", "已完成"]
const buyers = ["华东特钢集团"]

export function SupplierAgreement() {
  const [tab, setTab] = useState("全部")
  const [keyword, setKeyword] = useState("")
  const [rowsState, setRowsState] = useState<ConfirmRow[]>(() => buildRows())
  const [detail, setDetail] = useState<ConfirmRow | null>(null)
  // 确认 / 拒绝弹窗
  const [action, setAction] = useState<{ row: ConfirmRow; type: "confirm" | "reject" } | null>(null)
  const [rejectReason, setRejectReason] = useState("")

  const rows = useMemo(
    () =>
      rowsState.filter((r) => {
        if (tab !== "全部" && r.status !== tab) return false
        if (keyword && !`${r.orderId}${r.agreementTitle}${r.category}`.toLowerCase().includes(keyword.toLowerCase())) return false
        return true
      }),
    [rowsState, tab, keyword],
  )

  const pending = rowsState.filter((r) => r.status === "待供应商确认").length
  const confirmed = rowsState.filter((r) => r.status === "供应商已确认").length
  const rejected = rowsState.filter((r) => r.status === "供应商已拒绝").length
  const done = rowsState.filter((r) => r.status === "已完成").length

  function applyAction() {
    if (!action) return
    setRowsState((prev) =>
      prev.map((r) =>
        r.orderId === action.row.orderId
          ? { ...r, status: action.type === "confirm" ? "供应商已确认" : "供应商已拒绝" }
          : r,
      ),
    )
    setAction(null)
    setRejectReason("")
  }

  const columns: Column<ConfirmRow>[] = [
    { key: "orderId", header: "采购指令单号", className: "whitespace-nowrap font-medium text-foreground" },
    { key: "agreementTitle", header: "所属协议", className: "whitespace-nowrap" },
    { key: "buyer", header: "采购单位", className: "whitespace-nowrap" },
    { key: "category", header: "类别", className: "whitespace-nowrap", render: (r) => <StatusPill tone="gray">{r.category}</StatusPill> },
    { key: "qty", header: "采购量", className: "whitespace-nowrap tabular-nums" },
    { key: "price", header: "协议单价", className: "whitespace-nowrap tabular-nums text-primary font-medium" },
    { key: "amount", header: "预计金额", className: "whitespace-nowrap tabular-nums" },
    { key: "deliverBy", header: "要求交货", className: "whitespace-nowrap tabular-nums text-muted-foreground" },
    { key: "sentAt", header: "发单时间", className: "whitespace-nowrap tabular-nums text-muted-foreground" },
    {
      key: "status",
      header: "确认状态",
      className: "whitespace-nowrap",
      render: (r) => <StatusPill tone={orderTone[r.status]}>{r.status}</StatusPill>,
    },
    {
      key: "op",
      header: "操作",
      className: "whitespace-nowrap",
      render: (r) =>
        r.status === "待供应商确认" ? (
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => setAction({ row: r, type: "confirm" })}>
              <CheckCircle2 />
              确认
            </Button>
            <Button variant="outline" size="sm" onClick={() => setAction({ row: r, type: "reject" })}>
              <XCircle />
              拒绝
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setDetail(r)}>
            <FileSearch />
            查看
          </Button>
        ),
    },
  ]

  return (
    <div className="h-full overflow-y-auto p-6">
      <PageHeader title="协议单确认" desc="接收采购方按长期协议发起的采购指令单，在线确认或拒绝接单（无需竞价 / 报价）" />
      <div className="mt-4 space-y-5">
        <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" />
          <p className="text-sm text-muted-foreground">
            协议回收由双方<span className="font-medium text-foreground">提前签署长期协议</span>，采购方按协议发起采购指令单，供应商
            <span className="font-medium text-foreground">确认接单</span>即按协议单价供货结算，无需竞价或报价。
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="待确认" value={pending} tone="amber" />
          <StatCard label="已确认" value={confirmed} tone="green" />
          <StatCard label="已拒绝" value={rejected} tone="red" />
          <StatCard label="已完成" value={done} tone="primary" />
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <FilterBar>
              {tabs.map((t) => (
                <FilterChip key={t} active={tab === t} onClick={() => setTab(t)}>
                  {t}
                </FilterChip>
              ))}
            </FilterBar>
            <div className="flex items-center gap-2">
              <div className="flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm focus-within:border-primary">
                <Search className="size-4 text-muted-foreground" />
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="搜索指令单号 / 协议 / 类别"
                  className="w-56 bg-transparent outline-none placeholder:text-muted-foreground"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setTab("全部")
                  setKeyword("")
                }}
              >
                <RotateCcw />
                重置
              </Button>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          共 <span className="font-medium text-foreground tabular-nums">{rows.length}</span> 条采购指令单
        </p>
        <DataTable columns={columns} rows={rows} rowKey={(r) => r.orderId} stickyLastColumn />
      </div>

      {/* 确认 / 拒绝弹窗 */}
      <Modal
        open={!!action}
        onClose={() => {
          setAction(null)
          setRejectReason("")
        }}
        title={action?.type === "confirm" ? "确认接单" : "拒绝接单"}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setAction(null)
                setRejectReason("")
              }}
            >
              取消
            </Button>
            <Button
              disabled={action?.type === "reject" && !rejectReason.trim()}
              onClick={applyAction}
            >
              {action?.type === "confirm" ? "确认接单" : "确认拒绝"}
            </Button>
          </>
        }
      >
        {action && (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
              <InfoRow label="采购指令单号" value={action.row.orderId} />
              <InfoRow label="所属协议" value={action.row.agreementTitle} />
              <InfoRow label="类别 / 采购量" value={`${action.row.category} · ${action.row.qty}`} />
              <InfoRow label="协议单价" value={action.row.price} accent />
              <InfoRow label="预计金额" value={action.row.amount} />
              <InfoRow label="要求交货" value={action.row.deliverBy} />
            </div>
            {action.type === "confirm" ? (
              <p className="text-sm text-muted-foreground">
                确认后将按协议单价 <span className="font-medium text-primary">{action.row.price}</span> 供货，系统将同步生成履约订单。
              </p>
            ) : (
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-foreground">拒绝原因</span>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  placeholder="请填写拒绝接单的原因（如库存不足、交期无法满足等）"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </label>
            )}
          </div>
        )}
      </Modal>

      {/* 查看详情弹窗 */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title="采购指令单详情" footer={<Button onClick={() => setDetail(null)}>关闭</Button>}>
        {detail && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="size-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">{detail.orderId}</p>
                <p className="text-sm text-muted-foreground">{detail.agreementTitle}</p>
              </div>
              <div className="ml-auto">
                <StatusPill tone={orderTone[detail.status]}>{detail.status}</StatusPill>
              </div>
            </div>
            <div className="rounded-lg border border-border p-3 text-sm">
              <InfoRow label="采购单位" value={detail.buyer} />
              <InfoRow label="协议编号" value={detail.agreementId} />
              <InfoRow label="协议期限" value={detail.period} />
              <InfoRow label="定价方式" value={detail.priceRule} />
              <InfoRow label="类别 / 采购量" value={`${detail.category} · ${detail.qty}`} />
              <InfoRow label="协议单价" value={detail.price} accent />
              <InfoRow label="预计金额" value={detail.amount} />
              <InfoRow label="要求交货" value={detail.deliverBy} />
              <InfoRow label="发单时间" value={detail.sentAt} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function StatCard({ label, value, tone }: { label: string; value: number; tone: "primary" | "amber" | "green" | "red" }) {
  const toneCls = {
    primary: "text-primary",
    amber: "text-amber-600",
    green: "text-emerald-600",
    red: "text-red-600",
  }[tone]
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-1.5 text-2xl font-semibold ${toneCls}`}>
        {value}
        <span className="ml-1 text-sm font-normal text-muted-foreground">笔</span>
      </p>
    </div>
  )
}

function InfoRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className={`tabular-nums ${accent ? "font-medium text-primary" : "text-foreground"}`}>{value}</span>
    </div>
  )
}
