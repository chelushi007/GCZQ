"use client"

import { useState } from "react"
import { ArrowLeft, FileText, Send, Plus, CheckCircle2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { StatusPill, statusTone, type StatusTone } from "@/components/shared/status-pill"
import { DataTable, FilterBar, FilterChip, type Column } from "@/components/shared/data-table"
import { Modal } from "@/components/shared/modal"
import { agreementList, type AgreementItem, type AgreementOrder } from "@/lib/steel-data"

const tabs = ["全部", "履约中", "待签署", "已到期"]

const orderTone: Record<AgreementOrder["status"], StatusTone> = {
  待供应商确认: "amber",
  供应商已确认: "green",
  供应商已拒绝: "red",
  已完成: "gray",
}

export function PurchaseAgreement() {
  const [tab, setTab] = useState("全部")
  const [active, setActive] = useState<AgreementItem | null>(null)

  if (active) return <AgreementDetail item={active} onBack={() => setActive(null)} />

  const rows = tab === "全部" ? agreementList : agreementList.filter((b) => b.status === tab)

  const columns: Column<AgreementItem>[] = [
    { key: "id", header: "协议编号", render: (r) => <span className="font-medium text-foreground">{r.id}</span> },
    { key: "supplier", header: "供应商", render: (r) => <span className="font-medium text-foreground">{r.supplier}</span> },
    { key: "category", header: "废钢类别", render: (r) => <StatusPill tone="gray">{r.category}</StatusPill> },
    { key: "monthlyQty", header: "约定供货量" },
    { key: "price", header: "定价方式", render: (r) => <span className="text-primary">{r.price}</span> },
    { key: "period", header: "协议期限", className: "text-muted-foreground" },
    {
      key: "pending",
      header: "待确认发单",
      render: (r) => {
        const n = r.orders.filter((o) => o.status === "待供应商确认").length
        return n > 0 ? <StatusPill tone="amber">{`${n} 单待确认`}</StatusPill> : <span className="text-muted-foreground">—</span>
      },
    },
    { key: "status", header: "协议状态", render: (r) => <StatusPill tone={statusTone(r.status)}>{r.status}</StatusPill> },
    {
      key: "op",
      header: "操作",
      render: (r) =>
        r.status === "待签署" ? (
          <Button variant="ghost" size="sm" onClick={() => setActive(r)}>
            <FileText />
            查看
          </Button>
        ) : (
          <Button size="sm" onClick={() => setActive(r)}>
            <Send />
            发单
          </Button>
        ),
    },
  ]

  return (
    <div className="space-y-5">
      <PageHeader
        title="协议回收"
        desc="基于已签署的长期协议，采购方按需发起采购指令单，供应商在线确认接单即可履约"
      />

      <FilterBar>
        {tabs.map((t) => (
          <FilterChip key={t} active={tab === t} onClick={() => setTab(t)}>
            {t}
          </FilterChip>
        ))}
      </FilterBar>

      <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} />
    </div>
  )
}

/* ---------------- 协议详情 + 发单 ---------------- */

function AgreementDetail({ item, onBack }: { item: AgreementItem; onBack: () => void }) {
  const [orders, setOrders] = useState(item.orders)
  const [sendOpen, setSendOpen] = useState(false)
  const signed = item.status !== "待签署"

  const columns: Column<AgreementOrder>[] = [
    { key: "orderId", header: "指令单号", render: (r) => <span className="font-medium text-foreground">{r.orderId}</span> },
    { key: "category", header: "废钢类别", render: (r) => <StatusPill tone="gray">{r.category}</StatusPill> },
    { key: "qty", header: "采购量" },
    { key: "price", header: "协议单价", render: (r) => <span className="text-primary">{r.price}</span> },
    { key: "amount", header: "预计金额", render: (r) => <span className="font-medium text-foreground">{r.amount}</span> },
    { key: "deliverBy", header: "要求交货", className: "text-muted-foreground" },
    { key: "sentAt", header: "发单时间", className: "text-muted-foreground" },
    { key: "status", header: "确认状态", render: (r) => <StatusPill tone={orderTone[r.status]}>{r.status}</StatusPill> },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft />
          返回
        </Button>
        <div>
          <h2 className="text-lg font-semibold text-foreground">{item.id}</h2>
          <p className="text-sm text-muted-foreground">{item.supplier}</p>
        </div>
        <StatusPill tone={statusTone(item.status)}>{item.status}</StatusPill>
      </div>

      <SectionCard
        title="协议信息"
        extra={
          signed ? (
            <Button size="sm" onClick={() => setSendOpen(true)}>
              <Plus />
              发起采购指令单
            </Button>
          ) : undefined
        }
      >
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-3">
          <Field label="供应商" value={item.supplier} />
          <Field label="废钢类别" value={item.category} />
          <Field label="约定供货量" value={item.monthlyQty} />
          <Field label="定价方式" value={<span className="text-primary">{item.price}</span>} />
          <Field label="协议期限" value={item.period} />
          <Field label="签署日期" value={item.signedAt} />
          <Field label="联系人" value={item.contact} />
          <Field label="协议状态" value={<StatusPill tone={statusTone(item.status)}>{item.status}</StatusPill>} />
        </div>
      </SectionCard>

      {signed ? (
        <SectionCard title={`采购指令单（${orders.length}）`}>
          <div className="mb-3 flex items-start gap-2 rounded-md bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>协议回收无需竞价或报价，采购方按协议单价发起采购指令单，供应商确认后即进入履约发货。</span>
          </div>
          {orders.length ? (
            <DataTable columns={columns} rows={orders} rowKey={(r) => r.orderId} />
          ) : (
            <EmptyHint text="暂无采购指令单，点击右上角「发起采购指令单」向供应商发单" />
          )}
        </SectionCard>
      ) : (
        <SectionCard title="采购指令单">
          <EmptyHint text="协议尚未签署，签署生效后方可发起采购指令单" />
        </SectionCard>
      )}

      <SendOrderModal
        open={sendOpen}
        item={item}
        onClose={() => setSendOpen(false)}
        onSend={(o) => {
          setOrders((prev) => [o, ...prev])
          setSendOpen(false)
        }}
      />
    </div>
  )
}

function SendOrderModal({
  open,
  item,
  onClose,
  onSend,
}: {
  open: boolean
  item: AgreementItem
  onClose: () => void
  onSend: (o: AgreementOrder) => void
}) {
  const [qty, setQty] = useState("")
  const [deliverBy, setDeliverBy] = useState("")
  const [confirm, setConfirm] = useState(false)

  const submit = () => {
    const now = new Date()
    const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    onSend({
      orderId: `XYD${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.floor(Math.random() * 900 + 100)}`,
      category: item.category.split(" / ")[0],
      qty: qty ? `${qty} 吨` : "— 吨",
      price: item.price,
      amount: "按协议结算",
      deliverBy: deliverBy || "待定",
      sentAt: stamp,
      status: "待供应商确认",
    })
    setQty("")
    setDeliverBy("")
    setConfirm(false)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="发起采购指令单"
      footer={
        confirm ? (
          <>
            <Button variant="outline" onClick={() => setConfirm(false)}>
              返回修改
            </Button>
            <Button onClick={submit}>
              <CheckCircle2 />
              确认发单
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button disabled={!qty} onClick={() => setConfirm(true)}>
              下一步
            </Button>
          </>
        )
      }
    >
      {confirm ? (
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2 rounded-md bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>指令单将按协议单价「{item.price}」发送至 {item.supplier}，等待供应商确认接单。</span>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <Field label="供应商" value={item.supplier} />
            <Field label="废钢类别" value={item.category} />
            <Field label="采购量" value={`${qty} 吨`} />
            <Field label="要求交货日期" value={deliverBy || "待定"} />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 rounded-md border border-border bg-muted/30 p-3">
            <Field label="供应商" value={item.supplier} />
            <Field label="协议单价" value={<span className="text-primary">{item.price}</span>} />
          </div>
          <FormRow label="采购量（吨）" required>
            <input
              value={qty}
              onChange={(e) => setQty(e.target.value.replace(/[^\d.]/g, ""))}
              placeholder="请输入本次采购量"
              className="h-9 w-full rounded border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            />
          </FormRow>
          <FormRow label="要求交货日期">
            <input
              type="date"
              value={deliverBy}
              onChange={(e) => setDeliverBy(e.target.value)}
              className="h-9 w-full rounded border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            />
          </FormRow>
        </div>
      )}
    </Modal>
  )
}

/* ---------------- 通用元素 ---------------- */

function SectionCard({ title, extra, children }: { title: string; extra?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between gap-2 border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-4 w-1 rounded-full bg-primary" />
          <span className="text-sm font-semibold text-foreground">{title}</span>
        </div>
        {extra}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  )
}

function FormRow({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </span>
      {children}
    </label>
  )
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center">
      <FileText className="h-8 w-8 text-muted-foreground/50" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  )
}
