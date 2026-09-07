"use client"

import { useState } from "react"
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  FileText,
  Users,
  Megaphone,
  Gavel,
  Award,
  Trophy,
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Download,
  Medal,
  Building2,
  Phone,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusPill, statusTone, type StatusTone } from "@/components/shared/status-pill"
import type { BiddingItem } from "@/lib/steel-data"
import { cn } from "@/lib/utils"

type NodeState = "done" | "active" | "todo"

interface ManageAction {
  key: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  desc: string
}

interface ProcessNode {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  state: NodeState
  actions: ManageAction[]
}

const nodeStateMeta: Record<
  NodeState,
  { label: string; tone: "green" | "blue" | "gray"; Icon: React.ComponentType<{ className?: string }> }
> = {
  done: { label: "已完成", tone: "green", Icon: CheckCircle2 },
  active: { label: "进行中", tone: "blue", Icon: Clock },
  todo: { label: "待进行", tone: "gray", Icon: Circle },
}

function buildNodes(item: BiddingItem): ProcessNode[] {
  const isSettled = item.status === "已成交" || item.status === "已流标"
  const isBidPhase = item.status === "进行中" || item.status === "待开标"

  return [
    {
      id: "invite",
      title: "投标邀请",
      icon: Megaphone,
      state: "done",
      actions: [
        { key: "notice", label: "采购公告", icon: FileText, desc: "发布 / 查看本次竞价的采购公告与标的说明" },
        { key: "signup", label: "报名查看", icon: Users, desc: "查看供应商报名情况与资格审核状态" },
        { key: "change", label: "变更公告", icon: Megaphone, desc: "发布采购条款、时间等变更信息" },
      ],
    },
    {
      id: "bid",
      title: "竞价",
      icon: Gavel,
      state: isSettled ? "done" : isBidPhase ? "active" : "todo",
      actions: [{ key: "quotes", label: "查看报价", icon: Gavel, desc: "实时查看各供应商报价与排名" }],
    },
    {
      id: "award",
      title: "定标",
      icon: Award,
      state: isSettled ? "active" : "todo",
      actions: [
        { key: "shortlist", label: "入围候选人公示", icon: Trophy, desc: "公示进入定标环节的候选供应商名单" },
        { key: "result", label: "中标结果公告", icon: Award, desc: "发布最终中标供应商与成交结果" },
      ],
    },
  ]
}

/* ---------------- 子模块内容 ---------------- */

function SectionCard({
  title,
  extra,
  children,
}: {
  title: string
  extra?: React.ReactNode
  children: React.ReactNode
}) {
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

/* 1. 采购公告 */
function NoticeContent({ item }: { item: BiddingItem }) {
  return (
    <div className="space-y-4">
      <SectionCard
        title="公告信息"
        extra={
          <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
            <Download className="size-3.5" />
            下载公告 PDF
          </Button>
        }
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="公告标题" value={item.title} />
          <Field label="采购单位" value="盘古钢铁集团有限公司" />
          <Field label="采购方式" value="公开竞价" />
          <Field label="发布时间" value={item.publishTime} />
          <Field label="报名截止" value={item.signupEnd} />
          <Field label="采购预算" value={`¥ ${item.budget}`} />
        </div>
      </SectionCard>

      <SectionCard title="标的说明">
        <div className="space-y-4 text-sm leading-relaxed text-foreground">
          <div>
            <div className="mb-1 font-medium">一、采购标的</div>
            <p className="text-muted-foreground">
              本次竞价标的为 {item.category}，数量约 {item.qty}，位于 {item.region}
              ，具体规格及现场情况以现场勘验为准。请报名供应商在报名截止前完成资质审核。
            </p>
          </div>
          <div>
            <div className="mb-1 font-medium">二、报名要求</div>
            <p className="text-muted-foreground">
              1. 注册并审核通过成为"盘古循环资源"认证会员；2. 具备再生资源回收经营资质；3.
              近三年无重大违约及不良记录。
            </p>
          </div>
          <div>
            <div className="mb-1 font-medium">三、竞价规则</div>
            <p className="text-muted-foreground">
              采用多轮次报价（增价竞价），起始价以公告为准，竞价阶梯 500 元/吨，延时竞价周期 300
              秒，报价最高者中标。
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}

/* 2. 报名查看 */
const signupRows = [
  { name: "华东再生资源有限公司", contact: "王建国", phone: "138****6621", time: "2026-09-01 10:24", status: "审核通过" },
  { name: "江苏鑫盛物资回收公司", contact: "李海涛", phone: "139****3308", time: "2026-09-01 14:12", status: "审核通过" },
  { name: "浙江环晟金属科技", contact: "张伟", phone: "137****9902", time: "2026-09-02 09:33", status: "待审核" },
  { name: "上海宝钢再生资源", contact: "陈明", phone: "136****1157", time: "2026-09-02 16:41", status: "审核通过" },
  { name: "安徽绿源废旧金属", contact: "刘芳", phone: "135****8820", time: "2026-09-03 08:05", status: "已驳回" },
]
const signupTone: Record<string, StatusTone> = {
  审核通过: "green",
  待审核: "amber",
  已驳回: "red",
}

function SignupContent() {
  return (
    <SectionCard
      title="报名供应商"
      extra={<span className="text-xs text-muted-foreground">共 {signupRows.length} 家报名</span>}
    >
      <div className="mb-4 grid grid-cols-3 gap-3">
        {[
          { label: "报名总数", value: signupRows.length, tone: "text-foreground" },
          { label: "审核通过", value: signupRows.filter((r) => r.status === "审核通过").length, tone: "text-emerald-600" },
          { label: "待审核", value: signupRows.filter((r) => r.status === "待审核").length, tone: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-background px-4 py-3">
            <div className={cn("text-2xl font-semibold tabular-nums", s.tone)}>{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="whitespace-nowrap px-3 py-2.5 font-medium">供应商名称</th>
              <th className="whitespace-nowrap px-3 py-2.5 font-medium">联系人</th>
              <th className="whitespace-nowrap px-3 py-2.5 font-medium">联系方式</th>
              <th className="whitespace-nowrap px-3 py-2.5 font-medium">报名时间</th>
              <th className="whitespace-nowrap px-3 py-2.5 font-medium">审核状态</th>
              <th className="whitespace-nowrap px-3 py-2.5 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {signupRows.map((r) => (
              <tr key={r.name} className="border-b border-border/60 last:border-0">
                <td className="whitespace-nowrap px-3 py-3 font-medium text-foreground">{r.name}</td>
                <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{r.contact}</td>
                <td className="whitespace-nowrap px-3 py-3 tabular-nums text-muted-foreground">{r.phone}</td>
                <td className="whitespace-nowrap px-3 py-3 tabular-nums text-muted-foreground">{r.time}</td>
                <td className="whitespace-nowrap px-3 py-3">
                  <StatusPill tone={signupTone[r.status]}>{r.status}</StatusPill>
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  <button className="text-xs font-medium text-primary hover:underline">
                    {r.status === "待审核" ? "审核" : "查看"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  )
}

/* 3. 变更公告 */
const changeRows = [
  { title: "关于报名截止时间延期的变更公告", type: "时间变更", time: "2026-09-02 09:00", status: "已发布" },
  { title: "关于竞价阶梯调整的变更公告", type: "规则变更", time: "2026-09-01 15:30", status: "已发布" },
]

function ChangeContent() {
  return (
    <SectionCard
      title="变更公告"
      extra={
        <Button size="sm" className="h-8 gap-1 text-xs">
          <Plus className="size-3.5" />
          发布变更公告
        </Button>
      }
    >
      {changeRows.length === 0 ? (
        <div className="py-10 text-center text-sm text-muted-foreground">暂无变更公告</div>
      ) : (
        <ul className="divide-y divide-border">
          {changeRows.map((c) => (
            <li key={c.title} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Megaphone className="size-4" />
                </span>
                <div>
                  <div className="text-sm font-medium text-foreground">{c.title}</div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded bg-muted px-1.5 py-0.5">{c.type}</span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="size-3" />
                      {c.time}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusPill tone="green">{c.status}</StatusPill>
                <button className="inline-flex items-center gap-0.5 text-xs font-medium text-primary hover:underline">
                  查看
                  <ChevronRight className="size-3" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  )
}

/* 4. 查看报价 */
const quoteRows = [
  { rank: 1, name: "江苏鑫盛物资回收公司", price: "3,280", rounds: 6, time: "2026-09-04 15:58:12" },
  { rank: 2, name: "华东再生资源有限公司", price: "3,250", rounds: 5, time: "2026-09-04 15:57:40" },
  { rank: 3, name: "上海宝钢再生资源", price: "3,210", rounds: 5, time: "2026-09-04 15:55:03" },
  { rank: 4, name: "浙江环晟金属科技", price: "3,180", rounds: 4, time: "2026-09-04 15:50:22" },
]

function QuotesContent({ item }: { item: BiddingItem }) {
  const live = item.status === "进行中"
  return (
    <SectionCard
      title="实时报价"
      extra={
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
            live ? "bg-emerald-50 text-emerald-600" : "bg-muted text-muted-foreground",
          )}
        >
          <span className={cn("size-1.5 rounded-full", live ? "animate-pulse bg-emerald-500" : "bg-muted-foreground")} />
          {live ? "竞价进行中" : "竞价已结束"}
        </span>
      }
    >
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Field label="起始价 (元/吨)" value="3,000" />
        <Field label="当前最高价 (元/吨)" value={<span className="text-primary">{quoteRows[0].price}</span>} />
        <Field label="竞价阶梯 (元)" value="500" />
        <Field label="参与家数" value={`${quoteRows.length} 家`} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="whitespace-nowrap px-3 py-2.5 font-medium">排名</th>
              <th className="whitespace-nowrap px-3 py-2.5 font-medium">供应商</th>
              <th className="whitespace-nowrap px-3 py-2.5 font-medium">最新报价 (元/吨)</th>
              <th className="whitespace-nowrap px-3 py-2.5 font-medium">报价轮次</th>
              <th className="whitespace-nowrap px-3 py-2.5 font-medium">最后报价时间</th>
            </tr>
          </thead>
          <tbody>
            {quoteRows.map((r) => (
              <tr key={r.rank} className={cn("border-b border-border/60 last:border-0", r.rank === 1 && "bg-primary/5")}>
                <td className="whitespace-nowrap px-3 py-3">
                  <span
                    className={cn(
                      "inline-flex size-6 items-center justify-center rounded-full text-xs font-semibold",
                      r.rank === 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {r.rank}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-3 font-medium text-foreground">{r.name}</td>
                <td className="whitespace-nowrap px-3 py-3 font-semibold tabular-nums text-foreground">{r.price}</td>
                <td className="whitespace-nowrap px-3 py-3 tabular-nums text-muted-foreground">{r.rounds} 轮</td>
                <td className="whitespace-nowrap px-3 py-3 tabular-nums text-muted-foreground">{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  )
}

/* 5. 入围候选人公示 */
const shortlistRows = [
  { rank: 1, name: "江苏鑫盛物资回收公司", price: "3,280", score: 96.5, note: "第一候选人" },
  { rank: 2, name: "华东再生资源有限公司", price: "3,250", score: 93.2, note: "第二候选人" },
  { rank: 3, name: "上海宝钢再生资源", price: "3,210", score: 90.8, note: "第三候选人" },
]

function ShortlistContent() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground">
        入围候选人公示期为 <span className="font-medium">3 个工作日</span>
        ，公示期内如有异议请通过平台提交。公示期满无异议后进入中标结果公告环节。
      </div>
      <SectionCard title="入围候选人名单" extra={<span className="text-xs text-muted-foreground">公示中 · 剩余 2 天</span>}>
        <div className="space-y-3">
          {shortlistRows.map((r) => (
            <div
              key={r.rank}
              className={cn(
                "flex items-center justify-between gap-4 rounded-lg border p-4",
                r.rank === 1 ? "border-primary/40 bg-primary/5" : "border-border bg-background",
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-full",
                    r.rank === 1 ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                  )}
                >
                  <Medal className="size-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{r.name}</span>
                    <StatusPill tone={r.rank === 1 ? "blue" : "gray"}>{r.note}</StatusPill>
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">报价 {r.price} 元/吨</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold tabular-nums text-foreground">{r.score}</div>
                <div className="text-xs text-muted-foreground">综合得分</div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

/* 6. 中标结果公告 */
function ResultContent({ item }: { item: BiddingItem }) {
  const settled = item.status === "已成交"
  if (!settled) {
    return (
      <SectionCard title="中标结果公告">
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Award className="size-6" />
          </span>
          <div className="text-sm text-muted-foreground">
            当前竞价尚未完成定标，中标结果公告将在定标结束后发布。
          </div>
        </div>
      </SectionCard>
    )
  }
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-6">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Trophy className="size-6" />
          </span>
          <div>
            <div className="text-xs text-muted-foreground">中标供应商</div>
            <div className="text-xl font-semibold text-foreground">江苏鑫盛物资回收公司</div>
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <Field label="中标价格" value={<span className="text-primary">3,280 元/吨</span>} />
          <Field label="成交金额" value="¥ 2,624,000" />
          <Field label="定标时间" value="2026-09-05 10:00" />
        </div>
      </div>
      <SectionCard title="中标单位信息">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Building2 className="size-4 text-muted-foreground" />
            江苏鑫盛物资回收公司
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Users className="size-4 text-muted-foreground" />
            联系人：李海涛
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Phone className="size-4 text-muted-foreground" />
            139****3308
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <FileText className="size-4 text-muted-foreground" />
            成交编号：{item.id}-CJ
          </div>
        </div>
      </SectionCard>
    </div>
  )
}

const actionContent: Record<string, (item: BiddingItem) => React.ReactNode> = {
  notice: (item) => <NoticeContent item={item} />,
  signup: () => <SignupContent />,
  change: () => <ChangeContent />,
  quotes: (item) => <QuotesContent item={item} />,
  shortlist: () => <ShortlistContent />,
  result: (item) => <ResultContent item={item} />,
}

/* ---------------- 主组件 ---------------- */

export function BiddingManage({ item, onBack }: { item: BiddingItem; onBack: () => void }) {
  const nodes = buildNodes(item)
  const [openNode, setOpenNode] = useState<string | null>(nodes.find((n) => n.state === "active")?.id ?? "invite")
  const [activeAction, setActiveAction] = useState<{ node: ProcessNode; action: ManageAction } | null>(null)

  return (
    <div className="space-y-5">
      {/* 返回 + 标题 */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            返回竞价列表
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">{item.title}</h2>
            <StatusPill tone={statusTone(item.status)}>{item.status}</StatusPill>
          </div>
          <p className="text-sm text-muted-foreground">
            竞价单号 <span className="font-medium text-foreground">{item.id}</span> · {item.region} · {item.category} ·{" "}
            {item.qty}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 rounded-lg border border-border bg-card px-4 py-3 text-xs">
          <span className="text-muted-foreground">报名时间</span>
          <span className="tabular-nums text-foreground">
            {item.signupStart} ~ {item.signupEnd}
          </span>
          <span className="text-muted-foreground">竞价时间</span>
          <span className="tabular-nums text-foreground">
            {item.bidStart} ~ {item.bidEnd}
          </span>
        </div>
      </div>

      {/* 流程展示 */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="mb-1 text-sm font-medium text-foreground">项目流程</div>
        <p className="mb-5 text-xs text-muted-foreground">点击节点展开功能入口，再选择具体功能查看内容</p>
        <div className="flex items-center">
          {nodes.map((node, i) => {
            const meta = nodeStateMeta[node.state]
            const active = openNode === node.id
            return (
              <div key={node.id} className="flex flex-1 items-center">
                <button
                  onClick={() => setOpenNode(active ? null : node.id)}
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

        {/* 展开的功能入口 */}
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
                      const selected = activeAction?.action.key === a.key
                      return (
                        <button
                          key={a.key}
                          onClick={() => setActiveAction({ node, action: a })}
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

      {/* 子模块内容 */}
      {activeAction && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">{activeAction.node.title}</span>
            <ChevronRight className="size-3.5 text-muted-foreground" />
            <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
              <activeAction.action.icon className="size-4 text-primary" />
              {activeAction.action.label}
            </span>
          </div>
          {actionContent[activeAction.action.key]?.(item)}
        </div>
      )}
    </div>
  )
}
