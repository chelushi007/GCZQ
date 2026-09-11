"use client"

import { useMemo, type ReactNode } from "react"
import { geoMercator, geoPath } from "d3-geo"
import rawGeo from "@/lib/china-geo.json"

const geo = rawGeo as unknown as {
  features: { type: string; properties: { name: string }; geometry: unknown }[]
}

function shortName(full: string) {
  return full
    .replace("维吾尔自治区", "")
    .replace("壮族自治区", "")
    .replace("回族自治区", "")
    .replace("特别行政区", "")
    .replace("自治区", "")
    .replace(/省$/, "")
    .replace(/市$/, "")
}

export type MapLegendItem = { label: string; color: string }

const W = 800
const H = 640

export function ChinaMap({
  values,
  colorFor,
  hovered,
  onHover,
  legendTitle,
  legend,
  tooltip,
}: {
  values: Record<string, number>
  colorFor: (v: number) => string
  hovered: string | null
  onHover: (name: string | null) => void
  legendTitle: string
  legend: MapLegendItem[]
  tooltip?: (name: string) => ReactNode
}) {
  const { features, pathFor, centroids } = useMemo(() => {
    // fitSize 自动完成中国范围的居中与缩放
    const projection = geoMercator().fitSize([W, H], geo as never)
    const path = geoPath(projection)
    const features = geo.features.map((f) => ({ feature: f, name: shortName(f.properties.name) }))
    const centroids: Record<string, [number, number]> = {}
    for (const { feature, name } of features) {
      centroids[name] = path.centroid(feature as never) as [number, number]
    }
    return { features, pathFor: (f: unknown) => path(f as never), centroids }
  }, [])

  const hoveredCentroid = hovered ? centroids[hovered] : null

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="中国分布地图">
        <g>
          {features.map(({ feature, name }) => {
            const isHover = hovered === name
            return (
              <path
                key={name}
                d={pathFor(feature) ?? undefined}
                fill={isHover ? "#93c5fd" : "#cfe4fb"}
                stroke="#ffffff"
                strokeWidth={0.6}
                className="cursor-pointer transition-colors duration-150"
                onMouseEnter={() => onHover(name)}
                onMouseLeave={() => onHover(null)}
              />
            )
          })}
        </g>
        <g>
          {features.map(({ name }) => {
            const v = values[name] || 0
            if (!v) return null
            const c = centroids[name]
            if (!c) return null
            const [x, y] = c
            const r = 11 + Math.min(15, v / 22)
            const isHover = hovered === name
            return (
              <g
                key={`${name}-bubble`}
                className="cursor-pointer"
                onMouseEnter={() => onHover(name)}
                onMouseLeave={() => onHover(null)}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill={colorFor(v)}
                  fillOpacity={0.92}
                  stroke="#ffffff"
                  strokeWidth={isHover ? 2.5 : 1}
                />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#ffffff"
                  style={{ fontSize: 11, fontWeight: 600 }}
                >
                  {v}
                </text>
              </g>
            )
          })}
        </g>
      </svg>

      {/* 悬浮提示 */}
      {hovered && hoveredCentroid && tooltip && (
        <div
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full"
          style={{
            left: `${(hoveredCentroid[0] / W) * 100}%`,
            top: `${(hoveredCentroid[1] / H) * 100}%`,
          }}
        >
          <div className="mb-2 min-w-36 rounded-lg border border-border bg-popover px-3 py-2 text-popover-foreground shadow-lg">
            {tooltip(hovered)}
          </div>
        </div>
      )}

      {/* 图例 */}
      <div className="absolute bottom-3 left-3 rounded-lg border border-border bg-card/95 px-3 py-2 shadow-sm backdrop-blur">
        <p className="mb-1.5 text-xs font-medium text-foreground">{legendTitle}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {legend.map((l) => (
            <span key={l.label} className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <span className="size-2.5 rounded-sm" style={{ backgroundColor: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
      </div>

      {/* 南海诸岛 装饰角标 */}
      <div className="absolute bottom-3 right-3 flex h-20 w-14 flex-col items-center justify-end rounded-md border border-sky-200 bg-sky-50/70 pb-1">
        <span className="text-[10px] leading-tight text-sky-700">南海诸岛</span>
      </div>
    </div>
  )
}
