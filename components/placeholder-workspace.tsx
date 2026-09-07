import { Recycle, Truck, Cog, type LucideIcon } from "lucide-react"
import type { WorkspaceKey } from "@/lib/steel-data"

const config: Record<
  string,
  { icon: LucideIcon; title: string; desc: string; points: string[] }
> = {
  station: {
    icon: Recycle,
    title: "回收站工作台",
    desc: "回收站角色的工作台设计中，后续将参照钢厂结构展开。",
    points: [
      "向钢厂供货，申请成为钢厂合作供应商",
      "发布废钢出售需求：竞价 / 询价 / 固定价销售",
      "发布采购废钢需求，向上下游双向流转",
      "向自然人供应商反向开票",
    ],
  },
  supplier: {
    icon: Truck,
    title: "供应商工作台",
    desc: "供应商（企业 / 自然人）工作台设计中。",
    points: [
      "向回收站和钢厂供货",
      "发布采购与销售废钢需求",
      "自然人供应商仅支持发布销售需求，不支持采购",
      "自然人由回收站进行反向开票",
    ],
  },
  "ops-tbd": {
    icon: Cog,
    title: "运营工作台",
    desc: "运营工作台下级菜单待定，规划中。",
    points: ["角色与权限管理", "交易与合规监管", "数据看板与运营分析", "结算与开票管理"],
  },
}

export function PlaceholderWorkspace({ workspace }: { workspace: WorkspaceKey }) {
  const c = config[workspace] ?? config["ops-tbd"]
  const Icon = c.icon
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-dashed border-border bg-card p-8 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-7" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-foreground">{c.title}</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">{c.desc}</p>
        <ul className="mt-5 space-y-2 text-left">
          {c.points.map((p) => (
            <li key={p} className="flex items-start gap-2 text-sm text-foreground/80">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
