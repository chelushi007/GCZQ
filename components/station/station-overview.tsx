"use client"

import {
  ArrowUpRight,
  Gavel,
  Tag,
  FileSignature,
  ClipboardList,
  Wallet,
  Receipt,
  Users,
  Recycle,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { StatusPill } from "@/components/shared/status-pill"

type Role = "supplier" | "buyer"

interface StatCard {
  label: string
  value: string
  unit: string
  trend: string
  tone: "primary" | "amber" | "green" | "violet"
}

interface QuickAction {
  label: string
  desc: string
  icon: LucideIcon
  leaf: string
}

const toneBar: Record<string, string> = {
  primary: "bg-primary",
  amber: "bg-amber-500",
  green: "bg-emerald-500",
  violet: "bg-violet-500",
}

const supplierStats: StatCard[] = [
  { label: "进行中竞价", value: "6", unit: "场", trend: "+2", tone: "primary" },
  { label: "待报价一口价", value: "4", unit: "单", trend: "+1", tone: "amber" },
  { label: "本月供货量", value: "1,860", unit: "吨", trend: "+12%", tone: "green" },
  { label: "本月结算", value: "¥486.2", unit: "万", trend: "+8%", tone: "violet" },
]

const buyerStats: StatCard[] = [
  { label: "进行中采购", value: "8", unit: "单", trend: "+3", tone: "primary" },
  { label: "待确认一口价", value: "5", unit: "单", trend: "+2", tone: "amber" },
  { label: "本月采购量", value: "2,540", unit: "吨", trend: "+15%", tone: "green" },
  { label: "本月付款", value: "¥612.8", unit: "万", trend: "+9%", tone: "violet" },
]

const supplierActions: QuickAction[] = [
  { label: "竞价报名", desc: "浏览公告并报名", icon: Gavel, leaf: "station-supplier-bidding-signup" },
  { label: "我的竞价", desc: "参与竞价报价", icon: ClipboardList, leaf: "station-supplier-bidding-mine" },
  { label: "一口价报价", desc: "按一口价申报供货", icon: Tag, leaf: "station-supplier-fixed-quote" },
  { label: "协议单确认", desc: "确认采购方协议", icon: FileSignature, leaf: "station-supplier-agreement-confirm" },
  { label: "订单履约", desc: "合同签署与发货", icon: ClipboardList, leaf: "station-supplier-orders" },
  { label: "基地管理", desc: "邀约与合作申请", icon: Users, leaf: "station-supplier-base" },
]

const buyerActions: QuickAction[] = [
  { label: "竞价回收", desc: "发起竞价采购", icon: Gavel, leaf: "station-recycler-purchase-bidding" },
  { label: "一口价回收", desc: "设定一口价采购", icon: Tag, leaf: "station-recycler-purchase-fixed" },
  { label: "协议回收", desc: "发起协议采购", icon: FileSignature, leaf: "station-recycler-purchase-agreement" },
  { label: "订单管理", desc: "履约与结算", icon: ClipboardList, leaf: "station-recycler-orders" },
  { label: "费用支付", desc: "货款支付与发票", icon: Wallet, leaf: "station-recycler-finance-payment" },
  { label: "反向开票", desc: "自然人代开发票", icon: Receipt, leaf: "station-recycler-finance-reverse" },
]

const supplierActivities = [
  { type: "竞价", time: "10 分钟前", text: "「冲花板料竞价采购公告」已报名成功，等待竞价开始" },
  { type: "协议", time: "1 小时前", text: "华东特钢集团向您下达协议供货指令单 DD20260906-010" },
  { type: "订单", time: "3 小时前", text: "订单 DD20260902-018 已完成发货，等待采购方确认收货" },
  { type: "邀约", time: "昨天", text: "宝武钢铁向您发来合作基地邀约，待回复" },
]

const buyerActivities = [
  { type: "采购", time: "20 分钟前", text: "「重废竞价采购」已生成中标结果，可发布中标公告" },
  { type: "订单", time: "2 小时前", text: "订单 DD20260906-006 供应商已提交对账单，待确认" },
  { type: "财务", time: "4 小时前", text: "付款单 SK20260904-003 已完成线上支付 ¥84,350" },
  { type: "开票", time: "昨天", text: "自然人张建国反向开票额度校验通过，剩余 ¥405.7 万" },
]

export function StationOverview({ role, onNavigate }: { role: Role; onNavigate: (leaf: string) => void }) {
  const isSupplier = role === "supplier"
  const stats = isSupplier ? supplierStats : buyerStats
  const actions = isSupplier ? supplierActions : buyerActions
  const activities = isSupplier ? supplierActivities : buyerActivities

  return (
    <div className="space-y-6">
      <PageHeader
        title="总览"
        desc={
          isSupplier
            ? "供应商运营概况 · 城南再生资源回收基地"
            : "采购方运营概况 · 城南再生资源回收基地"
        }
      />

      {/* 指标卡 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-start justify-between">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <span className="inline-flex items-center gap-0.5 rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] font-medium text-emerald-700">
                <ArrowUpRight className="size-3" />
                {s.trend}
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-2xl font-semibold text-foreground">{s.value}</span>
              <span className="text-sm text-muted-foreground">{s.unit}</span>
            </div>
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
              <div className={`h-full w-2/3 rounded-full ${toneBar[s.tone]}`} />
            </div>
          </div>
        ))}
      </div>

      {/* 业务快捷操作 */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <ShoppingCart className="size-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">业务快捷操作</h3>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {isSupplier ? "快速进入报价、协议确认与订单履约" : "快速发起采购、订单履约与财务结算"}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
          {actions.map((a) => {
            const Icon = a.icon
            return (
              <button
                key={a.label}
                onClick={() => onNavigate(a.leaf)}
                className="group flex items-center gap-3 rounded-lg border border-border bg-background p-3 text-left transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{a.label}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 最新动态 */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <Recycle className="size-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">最新动态</h3>
        </div>
        <ul className="mt-4 space-y-4">
          {activities.map((a, i) => (
            <li key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                {i < activities.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <StatusPill tone="blue">{a.type}</StatusPill>
                  <span className="text-xs text-muted-foreground">{a.time}</span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-foreground">{a.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
