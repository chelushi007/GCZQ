"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  Users,
  Gavel,
  Tag,
  FileSignature,
  ChevronDown,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { MillMenuKey } from "@/lib/steel-data"
import { MillOverview } from "./mill-overview"
import { PurchaseBidding } from "./purchase-bidding"
import { PurchaseFixed } from "./purchase-fixed"
import { PurchaseAgreement } from "./purchase-agreement"
import { MillOrders } from "./mill-orders"
import { MillSuppliers } from "./mill-suppliers"

interface MenuNode {
  key: MillMenuKey
  label: string
  icon: LucideIcon
  index: string
}

const flatMenu: { top: MenuNode[]; purchase: MenuNode[]; bottom: MenuNode[] } = {
  top: [{ key: "overview", label: "总览", icon: LayoutDashboard, index: "一" }],
  purchase: [
    { key: "purchase-bidding", label: "竞价回收", icon: Gavel, index: "2.1" },
    { key: "purchase-fixed", label: "固定价（一口价）回收", icon: Tag, index: "2.2" },
    { key: "purchase-agreement", label: "协议回收", icon: FileSignature, index: "2.3" },
  ],
  bottom: [
    { key: "orders", label: "订单管理", icon: ClipboardList, index: "三" },
    { key: "suppliers", label: "供应商管理", icon: Users, index: "四" },
  ],
}

export function SteelMillWorkspace() {
  const [active, setActive] = useState<MillMenuKey>("overview")
  const [purchaseOpen, setPurchaseOpen] = useState(true)

  function MenuBtn({ node }: { node: MenuNode }) {
    const isActive = active === node.key
    const Icon = node.icon
    return (
      <button
        onClick={() => setActive(node.key)}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
          isActive
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-foreground/80 hover:bg-muted",
        )}
      >
        <Icon className={cn("size-4 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
        <span className="flex-1 text-left">{node.label}</span>
      </button>
    )
  }

  return (
    <div className="flex h-full">
      {/* 钢厂工作台内部侧边菜单 */}
      <div className="flex w-60 shrink-0 flex-col border-r border-border bg-card">
        <div className="border-b border-border px-4 py-3.5">
          <p className="text-sm font-semibold text-foreground">钢厂工作台</p>
          <p className="mt-0.5 text-xs text-muted-foreground">采购方 · 华东钢铁厂</p>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-2.5">
          {flatMenu.top.map((n) => (
            <MenuBtn key={n.key} node={n} />
          ))}

          {/* 采购管理分组 */}
          <div>
            <button
              onClick={() => setPurchaseOpen((v) => !v)}
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-muted"
            >
              <ShoppingCart className="size-4 shrink-0 text-muted-foreground" />
              <span className="flex-1 text-left">采购管理</span>
              <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", purchaseOpen && "rotate-180")} />
            </button>
            {purchaseOpen && (
              <div className="mt-1 space-y-1 border-l border-border pl-3 ml-4">
                {flatMenu.purchase.map((n) => {
                  const isActive = active === n.key
                  const Icon = n.icon
                  return (
                    <button
                      key={n.key}
                      onClick={() => setActive(n.key)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] transition-colors",
                        isActive ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <Icon className="size-3.5 shrink-0" />
                      <span className="flex-1 text-left">{n.label}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {flatMenu.bottom.map((n) => (
            <MenuBtn key={n.key} node={n} />
          ))}
        </nav>
      </div>

      {/* 钢厂工作台内容 */}
      <div className="flex-1 overflow-y-auto p-6">
        {active === "overview" && <MillOverview />}
        {active === "purchase-bidding" && <PurchaseBidding />}
        {active === "purchase-fixed" && <PurchaseFixed />}
        {active === "purchase-agreement" && <PurchaseAgreement />}
        {active === "orders" && <MillOrders />}
        {active === "suppliers" && <MillSuppliers />}
      </div>
    </div>
  )
}
