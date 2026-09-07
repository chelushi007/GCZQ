"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { WorkspaceNav } from "@/components/workspace-nav"
import { HomeEntry } from "@/components/home-entry"
import { SteelMillWorkspace } from "@/components/steel-mill/steel-mill-workspace"
import { PlaceholderWorkspace } from "@/components/placeholder-workspace"
import { workspaceNav, type WorkspaceKey, type MillMenuKey } from "@/lib/steel-data"

const titleMap: Record<WorkspaceKey, { group: string; leaf: string }> = (() => {
  const m = {} as Record<WorkspaceKey, { group: string; leaf: string }>
  for (const g of workspaceNav) {
    for (const l of g.children) m[l.key] = { group: g.label, leaf: l.label }
  }
  return m
})()

export default function Page() {
  const [active, setActive] = useState<WorkspaceKey>("mill")
  const [millSection, setMillSection] = useState<MillMenuKey>("overview")

  const crumb = titleMap[active]

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* 统一工作台菜单栏（彩色，可收起/展开） */}
      <WorkspaceNav
        active={active}
        onSelect={setActive}
        millSection={millSection}
        onMillSectionChange={setMillSection}
      />

      {/* 3. 工作台内容 */}
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-6">
          <div className="flex items-center gap-1.5 text-sm">
            <span className="font-semibold text-foreground">钢厂专区</span>
            <ChevronRight className="size-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">{crumb.group}</span>
            <ChevronRight className="size-3.5 text-muted-foreground" />
            <span className="font-medium text-foreground">{crumb.leaf}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">演示集团</span>
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
              演
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-hidden">
          {active === "home-entry" && (
            <div className="h-full overflow-y-auto">
              <HomeEntry />
            </div>
          )}
          {active === "mill" && <SteelMillWorkspace section={millSection} />}
          {(active === "station" || active === "supplier" || active === "ops-tbd") && (
            <PlaceholderWorkspace workspace={active} />
          )}
        </div>
      </main>
    </div>
  )
}
