"use client"

import { useMemo, useState } from "react"
import { MapPin, Building2, ShieldCheck, TrendingUp, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { networkBase, networkStats, recyclers } from "@/lib/steel-zone-data"
import { ChinaMap } from "./china-map"
import { SectionTitle } from "./demand-distribution"

function networkColor(v: number) {
  if (v >= 70) return "#1d4ed8"
  if (v >= 45) return "#3b82f6"
  if (v >= 25) return "#60a5fa"
  if (v >= 10) return "#93c5fd"
  return "#bfdbfe"
}

const networkLegend = [
  { label: "<10", color: "#bfdbfe" },
  { label: "10-24", color: "#93c5fd" },
  { label: "25-44", color: "#60a5fa" },
  { label: "45-69", color: "#3b82f6" },
  { label: "≥70", color: "#1d4ed8" },
]

const levelStyle: Record<string, string> = {
  战略合作: "bg-primary/10 text-primary",
  金牌回收商: "bg-amber-50 text-amber-600",
  认证回收商: "bg-emerald-50 text-emerald-600",
}

export function NetworkDistribution() {
  const [hovered, setHovered] = useState<string | null>(null)
  const stats = useMemo(() => networkStats(), [])

  const recoList = useMemo(() => {
    const scoped = hovered ? recyclers.filter((r) => r.province === hovered) : recyclers
    return scoped.length ? scoped : recyclers
  }, [hovered])

  return (
    <section className="mx-auto max-w-6xl px-6">
      <SectionTitle title="回收网点分布" sub="回收商 · 全国网点 · 网点推荐地图联动" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr_320px]">
        {/* 左：回收网点统计 */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <StatCard icon={<Building2 className="size-4" />} label="回收网点" value={stats.total.toLocaleString()} />
            <StatCard icon={<MapPin className="size-4" />} label="覆盖省份" value={String(stats.provinces)} />
            <StatCard icon={<ShieldCheck className="size-4" />} label="认证回收商" value={stats.certified.toLocaleString()} />
            <StatCard icon={<TrendingUp className="size-4" />} label="本月新增" value={`+${stats.monthlyAdd}`} />
          </div>
          <div className="flex-1 rounded-xl border border-border bg-card p-3">
            <p className="mb-2 text-sm font-semibold text-foreground">网点数量 · 省份排行</p>
            <ul className="space-y-2">
              {stats.top.map((t, i) => {
                const max = stats.top[0].count
                const isHover = hovered === t.province
                return (
                  <li
                    key={t.province}
                    onMouseEnter={() => setHovered(t.province)}
                    onMouseLeave={() => setHovered(null)}
                    className={cn(
                      "cursor-pointer rounded-md px-2 py-1.5 transition-colors",
                      isHover ? "bg-primary/5" : "hover:bg-muted",
                    )}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-foreground">
                        <span className={cn("flex size-4 items-center justify-center rounded text-[10px] font-semibold", i < 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                          {i + 1}
                        </span>
                        {t.province}
                      </span>
                      <span className="tabular-nums text-muted-foreground">{t.count} 个</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${(t.count / max) * 100}%` }} />
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* 中：中国地图 */}
        <div className="rounded-xl border border-border bg-card p-2">
          <ChinaMap
            values={networkBase}
            colorFor={networkColor}
            hovered={hovered}
            onHover={setHovered}
            legendTitle="回收网点（个）"
            legend={networkLegend}
            tooltip={(name) => (
              <div className="space-y-1">
                <p className="flex items-center gap-1 text-sm font-semibold text-foreground">
                  <MapPin className="size-3.5 text-primary" />
                  {name}
                </p>
                <p className="flex items-center justify-between gap-4 text-xs">
                  <span className="text-muted-foreground">回收网点</span>
                  <span className="font-medium text-primary">{networkBase[name] ?? 0} 个</span>
                </p>
              </div>
            )}
          />
        </div>

        {/* 右：网点推荐（与地图联动） */}
        <div className="flex max-h-[600px] flex-col gap-2 overflow-y-auto rounded-xl border border-border bg-card p-3">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              网点推荐
              {hovered && <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium text-primary">{hovered}</span>}
            </p>
            <span className="text-xs text-muted-foreground">共 {recoList.length} 家</span>
          </div>
          <ul className="space-y-2">
            {recoList.map((r) => (
              <li key={r.id} className="rounded-lg border border-border bg-background p-2.5 transition-colors hover:border-primary/40">
                <div className="flex items-start justify-between gap-2">
                  <p className="line-clamp-1 flex-1 text-[13px] font-medium text-foreground">{r.name}</p>
                  <span className={cn("shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium", levelStyle[r.level])}>
                    {r.level}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {r.categories.map((c) => (
                    <span key={c} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      {c}
                    </span>
                  ))}
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" />
                    {r.address}
                  </span>
                  <span className="flex items-center gap-0.5 font-medium text-foreground">
                    <Star className="size-3 fill-amber-400 text-amber-400" />
                    {r.monthlyCap}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</div>
      <p className="mt-2 text-lg font-semibold tabular-nums text-foreground">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  )
}
