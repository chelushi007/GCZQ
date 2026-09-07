"use client"

import { useState } from "react"
import {
  Home,
  Factory,
  Recycle,
  Truck,
  Settings2,
  Monitor,
  Users,
  Cog,
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  Gavel,
  Tag,
  FileSignature,
  ChevronDown,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { workspaceNav, type WorkspaceKey, type MillMenuKey } from "@/lib/steel-data"

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

interface MillNode {
  key: MillMenuKey
  label: string
  icon: LucideIcon
}

const millMenu: { top: MillNode[]; purchase: MillNode[]; bottom: MillNode[] } = {
  top: [{ key: "overview", label: "总览", icon: LayoutDashboard }],
  purchase: [
    { key: "purchase-bidding", label: "竞价回收", icon: Gavel },
    { key: "purchase-fixed", label: "固定价（一口价）回收", icon: Tag },
    { key: "purchase-agreement", label: "协议回收", icon: FileSignature },
  ],
  bottom: [
    { key: "orders", label: "订单管理", icon: ClipboardList },
    { key: "suppliers", label: "供应商管理", icon: Users },
  ],
}

export function WorkspaceNav({
  active,
  onSelect,
  millSection,
  onMillSectionChange,
}: {
  active: WorkspaceKey
  onSelect: (key: WorkspaceKey) => void
  millSection: MillMenuKey
  onMillSectionChange: (key: MillMenuKey) => void
}) {
  const [purchaseOpen, setPurchaseOpen] = useState(true)

  function MillBtn({ node }: { node: MillNode }) {
    const isActive = millSection === node.key
    const Icon = node.icon
    return (
      <button
        onClick={() => onMillSectionChange(node.key)}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] transition-colors",
          isActive
            ? "bg-primary/10 font-medium text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        <Icon className="size-3.5 shrink-0" />
        <span className="flex-1 text-left">{node.label}</span>
      </button>
    )
  }

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-sidebar">
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
                  const showMillMenu = leaf.key === "mill" && isActive
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
                        {leaf.desc && !showMillMenu && (
                          <span className="text-[10px] text-muted-foreground">{leaf.desc}</span>
                        )}
                      </button>

                      {/* 选中「钢厂」时内联展开其工作台子菜单 */}
                      {showMillMenu && (
                        <div className="mb-1 ml-4 mt-1 space-y-0.5 border-l border-border pl-3">
                          {millMenu.top.map((n) => (
                            <MillBtn key={n.key} node={n} />
                          ))}

                          <div>
                            <button
                              onClick={() => setPurchaseOpen((v) => !v)}
                              className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                              <ShoppingCart className="size-3.5 shrink-0" />
                              <span className="flex-1 text-left">采购管理</span>
                              <ChevronDown
                                className={cn("size-3.5 transition-transform", purchaseOpen && "rotate-180")}
                              />
                            </button>
                            {purchaseOpen && (
                              <div className="ml-3 mt-0.5 space-y-0.5 border-l border-border pl-2">
                                {millMenu.purchase.map((n) => (
                                  <MillBtn key={n.key} node={n} />
                                ))}
                              </div>
                            )}
                          </div>

                          {millMenu.bottom.map((n) => (
                            <MillBtn key={n.key} node={n} />
                          ))}
                        </div>
                      )}
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
