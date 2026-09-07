"use client"

import type { MillMenuKey } from "@/lib/steel-data"
import { MillOverview } from "./mill-overview"
import { PurchaseBidding } from "./purchase-bidding"
import { PurchaseFixed } from "./purchase-fixed"
import { PurchaseAgreement } from "./purchase-agreement"
import { MillOrders } from "./mill-orders"
import { MillSuppliers } from "./mill-suppliers"

export function SteelMillWorkspace({ section }: { section: MillMenuKey }) {
  return (
    <div className="h-full overflow-y-auto p-6">
      {section === "overview" && <MillOverview />}
      {section === "purchase-bidding" && <PurchaseBidding />}
      {section === "purchase-fixed" && <PurchaseFixed />}
      {section === "purchase-agreement" && <PurchaseAgreement />}
      {section === "orders" && <MillOrders />}
      {section === "suppliers" && <MillSuppliers />}
    </div>
  )
}
