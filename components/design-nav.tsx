"use client"

import { PanelLeftClose, PanelLeftOpen, Layers, FileStack } from "lucide-react"
import { cn } from "@/lib/utils"
import { designNav, type WorkspaceKey } from "@/lib/steel-data"

export function DesignNav({
  collapsed,
  onToggle,
  active,
  onSelect,
}: {
  collapsed: boolean
  onToggle: () => void
  active: WorkspaceKey
  onSelect: (key: WorkspaceKey) => void
}) {
  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col bg-slate-900 text-slate-300 transition-[width] duration-200",
        collapsed ? "w-14" : "w-60",
      )}
    >
      <div className="flex h-14 items-center gap-2 border-b border-white/10 px-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Layers className="size-4" />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">钢厂专区设计稿</p>
            <p className="truncate text-[11px] text-slate-400">Prototype · v0</p>
          </div>
        )}
        <button
          onClick={onToggle}
          aria-label={collapsed ? "展开设计稿导航" : "收起设计稿导航"}
          className="flex size-7 items-center justify-center rounded-md text-slate-400 hover:bg-white/10 hover:text-white"
        >
          {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {!collapsed && (
          <p className="px-2 pb-2 pt-1 text-[11px] font-medium uppercase tracking-wider text-slate-500">
            原型页面
          </p>
        )}
        <ul className="space-y-1">
          {designNav.map((item) => {
            const isActive = active === item.key
            return (
              <li key={item.key}>
                <button
                  onClick={() => onSelect(item.key)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-primary/20 text-white ring-1 ring-inset ring-primary/40"
                      : "text-slate-300 hover:bg-white/10 hover:text-white",
                    collapsed && "justify-center px-0",
                  )}
                  title={item.label}
                >
                  <FileStack className={cn("size-4 shrink-0", isActive ? "text-primary" : "text-slate-400")} />
                  {!collapsed && <span className="truncate text-left">{item.label}</span>}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {!collapsed && (
        <div className="border-t border-white/10 p-3 text-[11px] leading-relaxed text-slate-500">
          盘古循环资源 · 钢厂专区
          <br />
          用户工作台交互原型
        </div>
      )}
    </aside>
  )
}
