"use client"

import { useState } from "react"
import {
  ArrowLeft,
  FileText,
  FileSignature,
  Wallet,
  Banknote,
  Truck,
  PackageCheck,
  ChevronDown,
  CheckCircle2,
  Clock,
  Circle,
  ScrollText,
  Send,
  Eye,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { StatusPill, statusTone } from "@/components/shared/status-pill"
import { Modal } from "@/components/shared/modal"
import type { OrderItem } from "@/lib/steel-data"

export type FulfillPerspective = "purchaser" | "supplier"

type NodeState = "done" | "active" | "todo"

interface FulfillAction {
  key: string
  label: string
  desc: string
  icon: typeof FileText
}
interface FulfillNode {
  id: string
  title: string
  icon: typeof FileText
  state: NodeState
  actions: FulfillAction[]
}

const stateMeta: Record<NodeState, { label: string; Icon: typeof Clock; tone: "green" | "blue" | "gray" }> = {
  done: { label: "已完成", Icon: CheckCircle2, tone: "green" },
  active: { label: "进行中", Icon: Clock, tone: "blue" },
  todo: { label: "待处理", Icon: Circle, tone: "gray" },
}

function num(s: string) {
  return Number((s || "").replace(/[^\d.]/g, "")) || 0
}
function unitOf(s: string) {
  return (s || "").replace(/[\d.,\s]/g, "") || "吨"
}
function money(n: number) {
  return "¥" + Math.round(n).toLocaleString()
}
function calcAmount(item: OrderItem) {
  if (item.amount) return item.amount
  return money(num(item.qty) * num(item.unitPrice))
}

const nodeDefs: Record<FulfillPerspective, { id: string; title: string; icon: typeof FileText; actions: FulfillAction[] }[]> = {
  purchaser: [
    {
      id: "contract",
      title: "合同签署",
      icon: FileSignature,
      actions: [
        { key: "initiate", label: "合同发起", desc: "根据成交结果发起电子采购合同并推送供应商签署", icon: Send },
        { key: "view", label: "合同查看", desc: "查看合同条款、签署状态与合同文本", icon: Eye },
      ],
    },
    {
      id: "payment",
      title: "货款支付",
      icon: Wallet,
      actions: [
        { key: "reconcile", label: "发起对账", desc: "按到货数量与结算单价发起对账确认", icon: ScrollText },
        { key: "pay", label: "支付货款", desc: "对账通过后向供应商支付货款", icon: Banknote },
      ],
    },
    {
      id: "receipt",
      title: "确认收货",
      icon: PackageCheck,
      actions: [{ key: "receipt", label: "收货确认", desc: "登记到货批次并确认收货，跟踪应收 / 已收", icon: PackageCheck }],
    },
  ],
  supplier: [
    {
      id: "contract",
      title: "合同签署",
      icon: FileSignature,
      actions: [
        { key: "confirm", label: "确认合同", desc: "确认采购方发起的电子合同条款并完成签署", icon: CheckCircle2 },
        { key: "view", label: "查看合同", desc: "查看合同条款、签署状态与合同文本", icon: Eye },
      ],
    },
    {
      id: "collection",
      title: "货款收取",
      icon: Wallet,
      actions: [{ key: "collection", label: "货款收取", desc: "跟踪货款到账，核对应收 / 已收金额", icon: Banknote }],
    },
    {
      id: "ship",
      title: "发货",
      icon: Truck,
      actions: [{ key: "ship", label: "发货登记", desc: "按批次登记发货，跟踪应发 / 已发数量", icon: Send }],
    },
  ],
}

export function OrderFulfill({
  item,
  perspective,
  onBack,
}: {
  item: OrderItem
  perspective: FulfillPerspective
  onBack: () => void
}) {
  const defs = nodeDefs[perspective]
  const finished = item.status === "履约结束"
  // 已完成步骤集合：履约结束时全部完成；履约中默认合同已签署
  const [done, setDone] = useState<Set<string>>(
    () => new Set(finished ? defs.map((d) => d.id) : [defs[0].id]),
  )
  const nodes: FulfillNode[] = defs.map((d) => {
    let state: NodeState
    if (done.has(d.id)) state = "done"
    else if (defs.findIndex((x) => !done.has(x.id)) === defs.indexOf(d)) state = "active"
    else state = "todo"
    return { ...d, state }
  })

  const [openNode, setOpenNode] = useState<string>(nodes.find((n) => n.state === "active")?.id ?? nodes[0].id)
  const [action, setAction] = useState<{ node: string; key: string } | null>(null)

  const markDone = (id: string) => setDone((prev) => new Set(prev).add(id))

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            返回订单列表
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">订单履约 · {item.id}</h2>
            <StatusPill tone={statusTone(item.status)}>{item.status}</StatusPill>
            <StatusPill tone="violet">{item.channel}</StatusPill>
          </div>
          <p className="text-sm text-muted-foreground">
            {perspective === "purchaser" ? "供应商" : "采购单位"}{" "}
            <span className="font-medium text-foreground">
              {perspective === "purchaser" ? item.supplier : "华东特钢集团"}
            </span>{" "}
            · {item.category} · {item.qty} · <span className="text-primary">{item.unitPrice}</span>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 rounded-lg border border-border bg-card px-4 py-3 text-xs">
          <span className="text-muted-foreground">合同金额</span>
          <span className="tabular-nums text-foreground">
            {item.amount ? item.amount : `${calcAmount(item)}（协议周期结算）`}
          </span>
          <span className="text-muted-foreground">交货日期</span>
          <span className="tabular-nums text-foreground">{item.deliveryDate}</span>
          <span className="text-muted-foreground">视角</span>
          <span className="text-foreground">{perspective === "purchaser" ? "采购方履约" : "供应商履约"}</span>
        </div>
      </div>

      {/* 流程条 */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="mb-1 text-sm font-medium text-foreground">履约流程</div>
        <p className="mb-5 text-xs text-muted-foreground">点击节点展开功能入口，再选择具体功能办理</p>
        <div className="flex items-center">
          {nodes.map((node, i) => {
            const meta = stateMeta[node.state]
            const active = openNode === node.id
            return (
              <div key={node.id} className="flex flex-1 items-center">
                <button
                  onClick={() => setOpenNode(active ? "" : node.id)}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-2 rounded-md px-2 py-2 transition-colors",
                    active ? "bg-primary/5" : "hover:bg-muted/60",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-11 items-center justify-center rounded-full ring-2 transition-colors",
                      node.state === "done" && "bg-emerald-50 text-emerald-600 ring-emerald-200",
                      node.state === "active" && "bg-primary/10 text-primary ring-primary/30",
                      node.state === "todo" && "bg-muted text-muted-foreground ring-border",
                    )}
                  >
                    <node.icon className="size-5" />
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className={cn("text-sm font-medium", active ? "text-primary" : "text-foreground")}>
                      {node.title}
                    </span>
                    <ChevronDown
                      className={cn("size-3.5 text-muted-foreground transition-transform", active && "rotate-180")}
                    />
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <meta.Icon
                      className={cn(
                        "size-3",
                        meta.tone === "green" && "text-emerald-600",
                        meta.tone === "blue" && "text-primary",
                        meta.tone === "gray" && "text-muted-foreground",
                      )}
                    />
                    <span className="text-xs text-muted-foreground">{meta.label}</span>
                  </span>
                </button>
                {i < nodes.length - 1 && (
                  <div
                    className={cn(
                      "mx-1 h-0.5 w-8 shrink-0 rounded-full sm:w-16",
                      node.state === "done" ? "bg-emerald-300" : "bg-border",
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>

        {openNode && (
          <div className="mt-5 border-t border-border pt-5">
            {nodes
              .filter((n) => n.id === openNode)
              .map((node) => (
                <div key={node.id}>
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                    <node.icon className="size-4 text-primary" />
                    {node.title} · 功能入口
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {node.actions.map((a) => {
                      const selected = action?.node === node.id && action?.key === a.key
                      return (
                        <button
                          key={a.key}
                          onClick={() => setAction({ node: node.id, key: a.key })}
                          className={cn(
                            "group flex items-start gap-3 rounded-lg border p-4 text-left transition-colors",
                            selected
                              ? "border-primary bg-primary/5 ring-1 ring-primary"
                              : "border-border bg-background hover:border-primary/40 hover:bg-primary/5",
                          )}
                        >
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <a.icon className="size-5" />
                          </span>
                          <span className="space-y-0.5">
                            <span
                              className={cn(
                                "block text-sm font-medium",
                                selected ? "text-primary" : "text-foreground group-hover:text-primary",
                              )}
                            >
                              {a.label}
                            </span>
                            <span className="block text-xs leading-relaxed text-muted-foreground">{a.desc}</span>
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* 功能内容 */}
      {action && (
        <ActionPanel
          item={item}
          perspective={perspective}
          nodeId={action.node}
          actionKey={action.key}
          done={done.has(action.node)}
          onComplete={() => markDone(action.node)}
        />
      )}
    </div>
  )
}

function ActionPanel({
  item,
  perspective,
  nodeId,
  actionKey,
  done,
  onComplete,
}: {
  item: OrderItem
  perspective: FulfillPerspective
  nodeId: string
  actionKey: string
  done: boolean
  onComplete: () => void
}) {
  const contractNo = "HT" + item.id.replace("DD", "")
  const total = num(item.qty)
  const unit = unitOf(item.qty)
  const ratio = item.status === "履约结束" ? 1 : 0.6
  const delivered = Math.round(total * ratio)
  const amountNum = item.amount ? num(item.amount) : total * num(item.unitPrice)
  const paidNum = Math.round(amountNum * ratio)

  // ---- 合同签署 ----
  if (nodeId === "contract") {
    if (actionKey === "view") {
      return (
        <Panel title="合同文本">
          <ContractInfo item={item} contractNo={contractNo} amountNum={amountNum} />
          <div className="mt-3 flex justify-end">
            <Button variant="outline" size="sm">
              下载合同 PDF
            </Button>
          </div>
        </Panel>
      )
    }
    // 发起(采购方) / 确认(供应商)
    const isPurchaser = perspective === "purchaser"
    return (
      <ConfirmPanel
        title={isPurchaser ? "合同发起" : "确认合同"}
        infoNode={<ContractInfo item={item} contractNo={contractNo} amountNum={amountNum} />}
        done={done}
        doneText={isPurchaser ? "合同已发起并推送供应商签署" : "合同已确认签署"}
        buttonText={isPurchaser ? "发起电子合同" : "确认并签署合同"}
        confirmTitle={isPurchaser ? "确认发起合同？" : "确认签署合同？"}
        confirmDesc={
          isPurchaser
            ? `将按成交结果生成电子采购合同 ${contractNo} 并推送给「${item.supplier}」签署。`
            : `确认签署由采购方发起的电子合同 ${contractNo}，签署后即进入货款与发货履约环节。`
        }
        onComplete={onComplete}
      />
    )
  }

  // ---- 货款支付（采购方） ----
  if (nodeId === "payment") {
    if (actionKey === "reconcile") {
      return (
        <ConfirmPanel
          title="发起对账"
          infoNode={
            <StatGrid
              rows={[
                ["到货数量", `${delivered} / ${total} ${unit}`],
                ["结算单价", item.unitPrice],
                ["本期对账金额", money(paidNum)],
              ]}
            />
          }
          done={done}
          doneText="对账单已发起，等待供应商确认"
          buttonText="发起对账"
          confirmTitle="确认发起对账？"
          confirmDesc={`按已到货 ${delivered} ${unit} × ${item.unitPrice} 生成对账单，金额 ${money(paidNum)}。`}
          onComplete={onComplete}
        />
      )
    }
    // pay
    return (
      <ConfirmPanel
        title="支付货款"
        infoNode={
          <StatGrid
            rows={[
              ["应付货款", money(amountNum)],
              ["已付货款", money(paidNum)],
              ["待付货款", money(amountNum - paidNum)],
            ]}
          />
        }
        done={done}
        doneText="本期货款已支付"
        buttonText="支付货款"
        confirmTitle="确认支付货款？"
        confirmDesc={`向「${item.supplier}」支付本期货款 ${money(amountNum - paidNum)}。`}
        onComplete={onComplete}
      />
    )
  }

  // ---- 确认收货（采购方，应收/已收货量） ----
  if (nodeId === "receipt") {
    return (
      <ConfirmPanel
        title="收货确认"
        infoNode={
          <QtyStats title="收货进度" total={total} value={delivered} unit={unit} receivableLabel="应收货量" receivedLabel="已收货量" />
        }
        done={done}
        doneText="已确认收货"
        buttonText="确认收货"
        confirmTitle="确认收货？"
        confirmDesc={`确认已收到「${item.supplier}」交付的 ${delivered} ${unit} 货物。`}
        onComplete={onComplete}
      />
    )
  }

  // ---- 货款收取（供应商，应收/已收金额） ----
  if (nodeId === "collection") {
    return (
      <ConfirmPanel
        title="货款收取"
        infoNode={
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <BigStat label="应收货款" value={money(amountNum)} tone="muted" />
              <BigStat label="已收货款" value={money(paidNum)} tone="green" />
              <BigStat label="待收货款" value={money(amountNum - paidNum)} tone="amber" />
            </div>
            <ProgressBar value={paidNum} total={amountNum} />
          </div>
        }
        done={done}
        doneText="已确认收款"
        buttonText="确认收款"
        confirmTitle="确认收款？"
        confirmDesc={`确认已收到采购方支付的货款 ${money(paidNum)}。`}
        onComplete={onComplete}
      />
    )
  }

  // ---- 发货（供应商，应发/已发） ----
  if (nodeId === "ship") {
    return (
      <ConfirmPanel
        title="发货登记"
        infoNode={
          <QtyStats title="发货进度" total={total} value={delivered} unit={unit} receivableLabel="应发数量" receivedLabel="已发数量" />
        }
        done={done}
        doneText="本批次发货已登记"
        buttonText="登记发货"
        confirmTitle="确认登记发货？"
        confirmDesc={`按合同向采购方发货，本次登记后已发 ${delivered} / ${total} ${unit}。`}
        onComplete={onComplete}
      />
    )
  }

  return null
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="mb-4 text-sm font-medium text-foreground">{title}</div>
      {children}
    </div>
  )
}

function ConfirmPanel({
  title,
  infoNode,
  done,
  doneText,
  buttonText,
  confirmTitle,
  confirmDesc,
  onComplete,
}: {
  title: string
  infoNode: React.ReactNode
  done: boolean
  doneText: string
  buttonText: string
  confirmTitle: string
  confirmDesc: string
  onComplete: () => void
}) {
  const [open, setOpen] = useState(false)
  const [ok, setOk] = useState(done)
  return (
    <Panel title={title}>
      {infoNode}
      <div className="mt-4 flex items-center justify-end gap-3 border-t border-border pt-4">
        {ok ? (
          <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600">
            <CheckCircle2 className="size-4" />
            {doneText}
          </span>
        ) : (
          <Button size="sm" onClick={() => setOpen(true)}>
            {buttonText}
          </Button>
        )}
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={confirmTitle}
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setOk(true)
                onComplete()
                setOpen(false)
              }}
            >
              确认
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">{confirmDesc}</p>
      </Modal>
    </Panel>
  )
}

function ContractInfo({ item, contractNo, amountNum }: { item: OrderItem; contractNo: string; amountNum: number }) {
  return (
    <StatGrid
      rows={[
        ["合同编号", contractNo],
        ["采购单位", "华东特钢集团"],
        ["供应商", item.supplier],
        ["成交方式", item.channel],
        ["标的类别", item.category],
        ["合同数量", item.qty],
        ["结算单价", item.unitPrice],
        ["合同金额", item.amount ? item.amount : `${money(amountNum)}（协议周期结算）`],
        ["交货日期", item.deliveryDate],
      ]}
    />
  )
}

function StatGrid({ rows }: { rows: [string, string][] }) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-3 border-b border-dashed border-border py-1.5 text-sm">
          <span className="text-muted-foreground">{k}</span>
          <span className="text-right font-medium text-foreground">{v}</span>
        </div>
      ))}
    </div>
  )
}

function QtyStats({
  title,
  total,
  value,
  unit,
  receivableLabel,
  receivedLabel,
}: {
  title: string
  total: number
  value: number
  unit: string
  receivableLabel: string
  receivedLabel: string
}) {
  return (
    <div className="space-y-3">
      <div className="text-xs font-medium text-muted-foreground">{title}</div>
      <div className="grid grid-cols-3 gap-3">
        <BigStat label={receivableLabel} value={`${total} ${unit}`} tone="muted" />
        <BigStat label={receivedLabel} value={`${value} ${unit}`} tone="green" />
        <BigStat label="待处理" value={`${total - value} ${unit}`} tone="amber" />
      </div>
      <ProgressBar value={value} total={total} />
    </div>
  )
}

function BigStat({ label, value, tone }: { label: string; value: string; tone: "muted" | "green" | "amber" }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div
        className={cn(
          "mt-1 text-lg font-semibold tabular-nums",
          tone === "green" && "text-emerald-600",
          tone === "amber" && "text-amber-600",
          tone === "muted" && "text-foreground",
        )}
      >
        {value}
      </div>
    </div>
  )
}

function ProgressBar({ value, total }: { value: number; total: number }) {
  const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>完成进度</span>
        <span className="tabular-nums">{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
