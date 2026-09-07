import { ArrowUpRight, Gavel, Tag, FileSignature } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { StatusPill } from "@/components/shared/status-pill"
import { overviewStats, purchaseChannelStats, recentActivities } from "@/lib/steel-data"

const toneBar: Record<string, string> = {
  primary: "bg-primary",
  amber: "bg-amber-500",
  green: "bg-emerald-500",
  violet: "bg-violet-500",
}

const channelIcon = [Gavel, Tag, FileSignature]

export function MillOverview() {
  return (
    <div className="space-y-6">
      <PageHeader title="总览" desc="钢厂采购运营概况 · 演示集团 / 华东钢铁厂" />

      {/* 指标卡 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {overviewStats.map((s) => (
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* 采购渠道分布 */}
        <div className="rounded-lg border border-border bg-card p-5 lg:col-span-3">
          <h3 className="text-sm font-semibold text-foreground">采购渠道分布</h3>
          <p className="mt-1 text-xs text-muted-foreground">按竞价 / 固定价 / 协议三种回收方式统计</p>
          <ul className="mt-4 space-y-4">
            {purchaseChannelStats.map((c, i) => {
              const Icon = channelIcon[i]
              const max = Math.max(...purchaseChannelStats.map((x) => x.count))
              return (
                <li key={c.name} className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{c.name}</span>
                      <span className="text-muted-foreground">
                        {c.count} 单 · {c.amount}
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(c.count / max) * 100}%` }}
                      />
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        {/* 动态 */}
        <div className="rounded-lg border border-border bg-card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground">最新动态</h3>
          <ul className="mt-4 space-y-4">
            {recentActivities.map((a, i) => (
              <li key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                  {i < recentActivities.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
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
    </div>
  )
}
