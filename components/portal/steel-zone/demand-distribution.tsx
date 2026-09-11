"use client"

import { useMemo, useState } from "react"
import { ArrowRight, MapPin, Megaphone, ShoppingCart, Tag } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  scrapCategories,
  provinceDemand,
  categoryCount,
  demandRecos,
  type DemandType,
} from "@/lib/steel-zone-data"
import { ChinaMap } from "./china-map"

function demandColor(v: number) {
  if (v >= 200) return "#047857"
  if (v >= 130) return "#10b981"
  if (v >= 80) return "#34d399"
  if (v >= 40) return "#6ee7b7"
  return "#a7f3d0"
}

const demandLegend = [
  { label: "<40", color: "#a7f3d0" },
  { label: "40-79", color: "#6ee7b7" },
  { label: "80-129", color: "#34d399" },
  { label: "130-199", color: "#10b981" },
  { label: "≥200", color: "#047857" },
]

export function DemandDistribution({ onPublish }: { onPublish: () => void }) {
  const [cat, setCat] = useState("all")
  const [hovered, setHovered] = useState<string | null>(null)

  const demand = useMemo(() => provinceDemand(cat), [cat])
  const values = useMemo(() => {
    const v: Record<string, number> = {}
    for (const [k, d] of Object.entries(demand)) v[k] = d.total
    return v
  }, [demand])

  const catName = scrapCategories.find((c) => c.key === cat)?.name ?? "全部废钢"

  const recos = useMemo(() => {
    const base = demandRecos.filter((r) => cat === "all" || r.category === cat)
    const scoped = hovered ? base.filter((r) => r.province === hovered) : base
    const list = scoped.length ? scoped : base
    return {
      purchase: list.filter((r) => r.type === "purchase"),
      sales: list.filter((r) => r.type === "sales"),
    }
  }, [cat, hovered])

  return (
    <section className="mx-auto max-w-6xl px-6">
      <SectionTitle
        title="废钢需求分布"
        sub="废钢分类 · 全国分布 · 需求推荐三级联动"
        action={
          <button
            onClick={onPublish}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Megaphone className="size-4" />
            发布回收需求
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[200px_1fr_320px]">
        {/* 左：废钢分类导航（二级分类） */}
        <div className="overflow-hidden rounded-xl border border-border bg-sidebar text-sidebar-foreground">
          <div className="border-b border-sidebar-border px-4 py-3">
            <p className="text-sm font-semibold">废钢分类</p>
          </div>
          <ul className="max-h-[560px] overflow-y-auto p-2">
            {scrapCategories.map((c) => {
              const isActive = cat === c.key
              return (
                <li key={c.key}>
                  <button
                    onClick={() => setCat(c.key)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm transition-colors",
                      isActive
                        ? "bg-sidebar-primary font-medium text-sidebar-primary-foreground"
                        : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                    )}
                  >
                    <span>{c.name}</span>
                    <span className={cn("text-xs tabular-nums", isActive ? "text-sidebar-primary-foreground/80" : "text-sidebar-foreground/50")}>
                      {categoryCount(c.key).toLocaleString()}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
          <div className="border-t border-sidebar-border px-4 py-3 text-[11px] leading-relaxed text-sidebar-foreground/55">
            鼠标悬停地图省份可查看采购 / 销售需求数量，右侧需求推荐将联动更新
          </div>
        </div>

        {/* 中：中国地图 */}
        <div className="relative rounded-xl border border-border bg-card p-2">
          <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
            <span className="rounded-md border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground">
              {catName} · 全国需求分布
            </span>
          </div>
          <ChinaMap
            values={values}
            colorFor={demandColor}
            hovered={hovered}
            onHover={setHovered}
            legendTitle={`${catName}需求（条）`}
            legend={demandLegend}
            tooltip={(name) => {
              const d = demand[name]
              return (
                <div className="space-y-1">
                  <p className="flex items-center gap-1 text-sm font-semibold text-foreground">
                    <MapPin className="size-3.5 text-primary" />
                    {name}
                  </p>
                  <p className="flex items-center justify-between gap-4 text-xs">
                    <span className="text-muted-foreground">采购需求</span>
                    <span className="font-medium text-primary">{d?.purchase ?? 0} 条</span>
                  </p>
                  <p className="flex items-center justify-between gap-4 text-xs">
                    <span className="text-muted-foreground">销售需求</span>
                    <span className="font-medium text-emerald-600">{d?.sales ?? 0} 条</span>
                  </p>
                </div>
              )
            }}
          />
        </div>

        {/* 右：需求推荐（采购 / 销售联动） */}
        <div className="flex max-h-[600px] flex-col gap-3 overflow-y-auto rounded-xl border border-border bg-card p-3">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              需求推荐
              {hovered && <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium text-primary">{hovered}</span>}
            </p>
            <span className="text-xs text-muted-foreground">{catName}</span>
          </div>

          <RecoGroup type="purchase" items={recos.purchase} />
          <RecoGroup type="sales" items={recos.sales} />
        </div>
      </div>
    </section>
  )
}

function RecoGroup({ type, items }: { type: DemandType; items: typeof demandRecos }) {
  const isPurchase = type === "purchase"
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5">
        {isPurchase ? (
          <ShoppingCart className="size-3.5 text-primary" />
        ) : (
          <Tag className="size-3.5 text-emerald-600" />
        )}
        <span className="text-xs font-semibold text-foreground">{isPurchase ? "采购需求" : "销售需求"}</span>
        <span className="text-[11px] text-muted-foreground">共 {items.length} 条</span>
      </div>
      {items.length === 0 ? (
        <p className="rounded-md border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
          该分类 / 地区暂无推荐
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((r) => (
            <li
              key={r.id}
              className="group rounded-lg border border-border bg-background p-2.5 transition-colors hover:border-primary/40"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="line-clamp-1 flex-1 text-[13px] font-medium text-foreground">{r.title}</p>
                <span
                  className={cn(
                    "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium",
                    r.status === "竞价中"
                      ? "bg-primary/10 text-primary"
                      : r.status === "固定价"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600",
                  )}
                >
                  {r.status}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className={cn("text-sm font-semibold", isPurchase ? "text-primary" : "text-emerald-600")}>
                  {r.price.toLocaleString()}
                  <span className="ml-0.5 text-[11px] font-normal text-muted-foreground">{r.unit}</span>
                </span>
                <span className="text-[11px] text-muted-foreground">{r.spec}</span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                <MapPin className="size-3" />
                {r.place}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function SectionTitle({
  title,
  sub,
  action,
}: {
  title: string
  sub?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-4 mt-10 flex items-end justify-between gap-4">
      <div className="flex items-center gap-2.5">
        <span className="h-5 w-1.5 rounded bg-primary" />
        <div>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
        </div>
      </div>
      {action ?? (
        <button className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary">
          查看更多 <ArrowRight className="size-3" />
        </button>
      )}
    </div>
  )
}
