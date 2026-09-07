"use client"

import {
  Home,
  Factory,
  Recycle,
  Truck,
  Settings2,
  Monitor,
  Users,
  Cog,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { workspaceNav, type WorkspaceKey } from "@/lib/steel-data"

const groupIcon: Record<string, LucideIcon> = {
  front: Monitor,
  user: Users,
  ops: Cog,
}

const leafIcon: Record<WorkspaceKey, LucideIcon> = {
  "home-entry": Home,
  mill: Factory,
  station: Recycle,
  supplier: Truck,
  "ops-tbd": Settings2,
}

export function WorkspaceNav({
  active,
  onSelect,
}: {
  active: WorkspaceKey
  onSelect: (key: WorkspaceKey) => void
}) {
  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Factory className="size-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">钢厂专区</p>
          <p className="text-[11px] text-muted-foreground">工作台菜单</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {workspaceNav.map((group) => {
          const GroupIcon = groupIcon[group.id]
          return (
            <div key={group.id} className="mb-4">
              <div className="flex items-center gap-1.5 px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {GroupIcon && <GroupIcon className="size-3.5" />}
                {group.label}
              </div>
              <ul className="space-y-0.5">
                {group.children.map((leaf) => {
                  const Icon = leafIcon[leaf.key]
                  const isActive = active === leaf.key
                  return (
                    <li key={leaf.key}>
                      <button
                        onClick={() => onSelect(leaf.key)}
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                          isActive
                            ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-muted",
                        )}
                      >
                        <Icon className={cn("size-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
                        <span className="flex-1 text-left">{leaf.label}</span>
                        {leaf.desc && (
                          <span className="text-[10px] text-muted-foreground">{leaf.desc}</span>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
