"use client"

import { useState } from "react"
import {
  ArrowLeft,
  ChevronDown,
  FileText,
  Users,
  Megaphone,
  Gavel,
  Award,
  Trophy,
  CheckCircle2,
  Circle,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusPill, statusTone } from "@/components/shared/status-pill"
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

const nodeStateMeta: Record<NodeState, { label: string; tone: "green" | "blue" | "gray"; Icon: React.ComponentType<{ className?: string }> }> = {
  done: { label: "已完成", tone: "green", Icon: CheckCircle2 },
  active: { label: "进行中", tone: "blue", Icon: Clock },
  todo: { label: "待进行", tone: "gray", Icon: Circle },
}

function buildNodes(item: BiddingItem): ProcessNode[] {
  // 依据竞价状态推断各节点进度
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

export function BiddingManage({ item, onBack }: { item: BiddingItem; onBack: () => void }) {
  const nodes = buildNodes(item)
  const [openNode, setOpenNode] = useState<string | null>(nodes.find((n) => n.state === "active")?.id ?? "invite")

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
          <span className="text-foreground tabular-nums">
            {item.signupStart} ~ {item.signupEnd}
          </span>
          <span className="text-muted-foreground">竞价时间</span>
          <span className="text-foreground tabular-nums">
            {item.bidStart} ~ {item.bidEnd}
          </span>
        </div>
      </div>

      {/* 流程展示 */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="mb-1 text-sm font-medium text-foreground">项目流程</div>
        <p className="mb-5 text-xs text-muted-foreground">点击节点下方入口展开对应操作</p>
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

        {/* 展开的操作入口 */}
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
                    {node.actions.map((a) => (
                      <button
                        key={a.key}
                        className="group flex items-start gap-3 rounded-lg border border-border bg-background p-4 text-left transition-colors hover:border-primary/40 hover:bg-primary/5"
                      >
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <a.icon className="size-5" />
                        </span>
                        <span className="space-y-0.5">
                          <span className="block text-sm font-medium text-foreground group-hover:text-primary">
                            {a.label}
                          </span>
                          <span className="block text-xs leading-relaxed text-muted-foreground">{a.desc}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
