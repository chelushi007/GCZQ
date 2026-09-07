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
  PanelLeftClose,
  PanelLeftOpen,
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
  const [collapsed, setCollapsed] = useState(false)
  const [purchaseOpen, setPurchaseOpen] = useState(true)

  function MillBtn({ node }: { node: MillNode }) {
    const isActive = millSection === node.key
    const Icon = node.icon
    return (
      <button
        onClick={() => onMillSectionChange(node.key)}
        title={node.label}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] transition-colors",
          isActive
            ? "bg-sidebar-primary font-medium text-sidebar-primary-foreground"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
        )}
      >
        <Icon className="size-3.5 shrink-0" />
        <span className="flex-1 text-left">{node.label}</span>
      </button>
    )
  }

  return (
    <aside
      className={cn(
        "relative flex h-full shrink-0 flex-col bg-sidebar text-sidebar-foreground transition-[width] duration-200",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* 顶部品牌 */}
      <div
        className={cn(
          "flex h-14 items-center gap-2 border-b border-sidebar-border px-3",
          collapsed && "justify-center px-0",
        )}
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
          <Factory className="size-4.5" />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">钢厂专区</p>
            <p className="truncate text-[11px] text-sidebar-foreground/60">工作台</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {workspaceNav.map((group) => {
          const GroupIcon = groupIcon[group.id]
          return (
            <div key={group.id} className="mb-4">
              {!collapsed && (
                <div className="flex items-center gap-1.5 px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-sidebar-foreground/50">
                  {GroupIcon && <GroupIcon className="size-3.5" />}
                  {group.label}
                </div>
              )}
              <ul className="space-y-0.5">
                {group.children.map((leaf) => {
                  const Icon = leafIcon[leaf.key]
                  const isActive = active === leaf.key
                  const showMillMenu = leaf.key === "mill" && isActive && !collapsed
                  return (
                    <li key={leaf.key}>
                      <button
                        onClick={() => onSelect(leaf.key)}
                        title={leaf.label}
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-md py-2 text-sm transition-colors",
                          collapsed ? "justify-center px-0" : "px-2.5",
                          isActive
                            ? "bg-sidebar-primary font-medium text-sidebar-primary-foreground"
                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                        )}
                      >
                        <Icon
                          className={cn(
                            "size-4 shrink-0",
                            isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/70",
                          )}
                        />
                        {!collapsed && (
                          <>
                            <span className="flex-1 text-left">{leaf.label}</span>
                            {leaf.desc && !showMillMenu && (
                              <span
                                className={cn(
                                  "text-[10px]",
                                  isActive ? "text-sidebar-primary-foreground/70" : "text-sidebar-foreground/50",
                                )}
                              >
                                {leaf.desc}
                              </span>
                            )}
                          </>
                        )}
                      </button>

                      {/* 选中「钢厂」时内联展开其工作台子菜单 */}
                      {showMillMenu && (
                        <div className="mb-1 ml-4 mt-1 space-y-0.5 border-l border-sidebar-border pl-3">
                          {millMenu.top.map((n) => (
                            <MillBtn key={n.key} node={n} />
                          ))}

                          <div>
                            <button
                              onClick={() => setPurchaseOpen((v) => !v)}
                              className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
                            >
                              <ShoppingCart className="size-3.5 shrink-0" />
                              <span className="flex-1 text-left">采购管理</span>
                              <ChevronDown
                                className={cn("size-3.5 transition-transform", purchaseOpen && "rotate-180")}
                              />
                            </button>
                            {purchaseOpen && (
                              <div className="ml-3 mt-0.5 space-y-0.5 border-l border-sidebar-border pl-2">
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

      {/* 底部折叠按钮：整行、紧贴最底部、不突出边缘 */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        title={collapsed ? "展开菜单" : "收起菜单"}
        aria-label={collapsed ? "展开菜单" : "收起菜单"}
        className={cn(
          "flex h-11 shrink-0 items-center gap-2 border-t border-sidebar-border text-[13px] text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
          collapsed ? "justify-center px-0" : "px-4",
        )}
      >
        {collapsed ? (
          <PanelLeftOpen className="size-4 shrink-0" />
        ) : (
          <>
            <PanelLeftClose className="size-4 shrink-0" />
            <span className="flex-1 text-left">收起菜单</span>
          </>
        )}
      </button>
    </aside>
  )
}
