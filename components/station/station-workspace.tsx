"use client"

import { Recycle, ClipboardList, FileText, Wallet, ShieldCheck, HandCoins, type LucideIcon } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { DataTable, type Column } from "@/components/shared/data-table"
import { StatusPill } from "@/components/shared/status-pill"

// 各回收站叶子节点对应的内容渲染
const leafMeta: Record<string, { icon: LucideIcon; title: string; desc: string }> = {
  "station-supplier-bidding-signup": {
    icon: ClipboardList,
    title: "网上报名",
    desc: "浏览钢厂竞价公告并在线报名参与竞价",
  },
  "station-supplier-bidding-mine": { icon: FileText, title: "我的竞价", desc: "查看已报名 / 进行中 / 已结束的竞价项目" },
  "station-supplier-bidding-fee": { icon: Wallet, title: "缴纳报名费", desc: "缴纳竞价项目报名费，缴费后方可参与竞价" },
  "station-supplier-bidding-deposit": { icon: ShieldCheck, title: "缴纳保证金", desc: "缴纳投标保证金，未中标后按规则退还" },
  "station-supplier-bidding-service": { icon: HandCoins, title: "缴纳服务费", desc: "中标后缴纳平台交易服务费" },
  "station-recycler": { icon: Recycle, title: "回收商", desc: "回收商角色工作台设计中" },
  "station-seller": { icon: Recycle, title: "销售方", desc: "销售方角色工作台设计中" },
}

type SignupRow = { no: string; title: string; region: string; deadline: string; status: string; tone: "green" | "amber" }

function SignupContent() {
  const rows: SignupRow[] = [
    { no: "JJ20260907-003", title: "华东厂区废钢竞价回收", region: "华东", deadline: "2026-09-10 17:00", status: "报名中", tone: "green" },
    { no: "JJ20260906-011", title: "重废工业边角料竞价", region: "华北", deadline: "2026-09-09 12:00", status: "报名中", tone: "green" },
    { no: "JJ20260905-008", title: "机械设备拆解废钢", region: "华南", deadline: "2026-09-08 18:00", status: "即将截止", tone: "amber" },
  ]
  const columns: Column<SignupRow>[] = [
    { key: "no", header: "竞价单号", className: "whitespace-nowrap font-medium text-foreground" },
    { key: "title", header: "公告标题", className: "whitespace-nowrap" },
    { key: "region", header: "区域", className: "whitespace-nowrap" },
    { key: "deadline", header: "报名截止时间", className: "whitespace-nowrap tabular-nums" },
    { key: "status", header: "报名状态", render: (r) => <StatusPill label={r.status} tone={r.tone} /> },
    {
      key: "op",
      header: "操作",
      render: () => (
        <button className="whitespace-nowrap rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90">
          立即报名
        </button>
      ),
    },
  ]
  return <DataTable columns={columns} rows={rows} rowKey={(r) => r.no} stickyLastColumn />
}

type MyBidRow = { no: string; title: string; price: string; state: string; tone: "primary" | "green" | "gray" }

function MyBiddingContent() {
  const rows: MyBidRow[] = [
    { no: "JJ20260907-003", title: "华东厂区废钢竞价回收", state: "进行中", tone: "primary", price: "2,650" },
    { no: "JJ20260904-006", title: "拆船板废钢竞价", state: "已中标", tone: "green", price: "2,880" },
    { no: "JJ20260901-002", title: "汽车压块竞价回收", state: "未中标", tone: "gray", price: "3,010" },
  ]
  const columns: Column<MyBidRow>[] = [
    { key: "no", header: "竞价单号", className: "whitespace-nowrap font-medium text-foreground" },
    { key: "title", header: "公告标题", className: "whitespace-nowrap" },
    { key: "price", header: "我的报价(元/吨)", className: "whitespace-nowrap tabular-nums" },
    { key: "state", header: "竞价状态", render: (r) => <StatusPill label={r.state} tone={r.tone} /> },
    {
      key: "op",
      header: "操作",
      render: () => (
        <button className="whitespace-nowrap rounded-md border border-border px-3 py-1 text-xs font-medium text-foreground hover:bg-accent">
          查看详情
        </button>
      ),
    },
  ]
  return <DataTable columns={columns} rows={rows} rowKey={(r) => r.no} stickyLastColumn />
}

type PayRow = { no: string; title: string; amount: string; status: string; tone: "amber" | "green" }

function PaymentContent({ kind }: { kind: "fee" | "deposit" | "service" }) {
  const label = kind === "fee" ? "报名费" : kind === "deposit" ? "保证金" : "服务费"
  const rows: PayRow[] = [
    {
      no: "JJ20260907-003",
      title: "华东厂区废钢竞价回收",
      amount: kind === "deposit" ? "50,000" : kind === "service" ? "3,200" : "500",
      status: "待缴纳",
      tone: "amber",
    },
    {
      no: "JJ20260904-006",
      title: "拆船板废钢竞价",
      amount: kind === "deposit" ? "80,000" : kind === "service" ? "4,800" : "500",
      status: "已缴纳",
      tone: "green",
    },
  ]
  const totalDue = rows.filter((r) => r.status === "待缴纳").length
  const columns: Column<PayRow>[] = [
    { key: "no", header: "竞价单号", className: "whitespace-nowrap font-medium text-foreground" },
    { key: "title", header: "公告标题", className: "whitespace-nowrap" },
    { key: "amount", header: `${label}(元)`, className: "whitespace-nowrap tabular-nums" },
    { key: "status", header: "缴纳状态", render: (r) => <StatusPill label={r.status} tone={r.tone} /> },
    {
      key: "op",
      header: "操作",
      render: (r) =>
        r.status === "待缴纳" ? (
          <button className="whitespace-nowrap rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90">
            去缴纳
          </button>
        ) : (
          <button className="whitespace-nowrap rounded-md border border-border px-3 py-1 text-xs font-medium text-foreground hover:bg-accent">
            查看凭证
          </button>
        ),
    },
  ]
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label={`待缴纳${label}`} value={String(totalDue)} unit="笔" tone="amber" />
        <StatCard label={`已缴纳${label}`} value={String(rows.length - totalDue)} unit="笔" tone="green" />
        <StatCard label="累计缴纳金额" value="¥84,800" unit="" tone="primary" />
      </div>
      <DataTable columns={columns} rows={rows} rowKey={(r) => r.no} stickyLastColumn />
    </div>
  )
}

function StatCard({
  label,
  value,
  unit,
  tone,
}: {
  label: string
  value: string
  unit: string
  tone: "primary" | "amber" | "green"
}) {
  const toneCls = { primary: "text-primary", amber: "text-amber-600", green: "text-emerald-600" }[tone]
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-1.5 text-2xl font-semibold ${toneCls}`}>
        {value}
        {unit && <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>}
      </p>
    </div>
  )
}

export function StationWorkspace({ leaf }: { leaf: string }) {
  const meta = leafMeta[leaf] ?? leafMeta["station-recycler"]

  return (
    <div className="h-full overflow-y-auto p-6">
      <PageHeader title={meta.title} desc={meta.desc} />
      <div className="mt-4">
        {leaf === "station-supplier-bidding-signup" && <SignupContent />}
        {leaf === "station-supplier-bidding-mine" && <MyBiddingContent />}
        {leaf === "station-supplier-bidding-fee" && <PaymentContent kind="fee" />}
        {leaf === "station-supplier-bidding-deposit" && <PaymentContent kind="deposit" />}
        {leaf === "station-supplier-bidding-service" && <PaymentContent kind="service" />}
        {(leaf === "station-recycler" || leaf === "station-seller") && (
          <div className="flex h-[50vh] items-center justify-center">
            <div className="w-full max-w-md rounded-xl border border-dashed border-border bg-card p-8 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Recycle className="size-7" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-foreground">{meta.title}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                该角色工作台规划中，后续将参照供应商结构展开各业务模块。
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
