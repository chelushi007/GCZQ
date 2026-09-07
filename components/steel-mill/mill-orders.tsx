"use client"

import { useState } from "react"
import { Search, Wallet, FileSignature } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { StatusPill, statusTone } from "@/components/shared/status-pill"
import { DataTable, FilterBar, FilterChip, type Column } from "@/components/shared/data-table"
import { orderList, type OrderItem } from "@/lib/steel-data"

const tabs = ["全部", "待结算", "结算中", "已结算"]
const channelTone: Record<string, "blue" | "amber" | "violet"> = {
  竞价: "blue",
  固定价: "amber",
  协议: "violet",
}

export function MillOrders() {
  const [tab, setTab] = useState("全部")
  const rows = tab === "全部" ? orderList : orderList.filter((o) => o.settlement === tab)

  const columns: Column<OrderItem>[] = [
    { key: "id", header: "订单编号", render: (r) => <span className="font-medium text-foreground">{r.id}</span> },
    { key: "supplier", header: "供应商" },
    { key: "channel", header: "成交方式", render: (r) => <StatusPill tone={channelTone[r.channel]}>{r.channel}</StatusPill> },
    { key: "category", header: "类别" },
    { key: "qty", header: "数量" },
    { key: "amount", header: "订单金额", render: (r) => <span className="font-medium tabular-nums text-foreground">{r.amount}</span> },
    {
      key: "settlement",
      header: "结算状态",
      render: (r) => (
        <span className="inline-flex items-center gap-1">
          <Wallet className="size-3.5 text-muted-foreground" />
          <StatusPill tone={statusTone(r.settlement)}>{r.settlement}</StatusPill>
        </span>
      ),
    },
    {
      key: "contract",
      header: "合同状态",
      render: (r) => (
        <span className="inline-flex items-center gap-1">
          <FileSignature className="size-3.5 text-muted-foreground" />
          <StatusPill tone={statusTone(r.contract)}>{r.contract}</StatusPill>
        </span>
      ),
    },
    { key: "createdAt", header: "下单日期", className: "text-muted-foreground" },
    {
      key: "op",
      header: "操作",
      render: () => (
        <Button variant="ghost" size="sm">
          详情
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <PageHeader
        title="订单管理"
        desc="订单查询贯通结算与合同：一条订单可追溯成交、结算单与电子合同"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterBar>
          {tabs.map((t) => (
            <FilterChip key={t} active={tab === t} onClick={() => setTab(t)}>
              {t}
            </FilterChip>
          ))}
        </FilterBar>
        <div className="flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 text-sm text-muted-foreground">
          <Search className="size-4" />
          <input
            placeholder="搜索订单编号 / 供应商"
            className="w-44 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} />

      <p className="text-xs text-muted-foreground">
        说明：订单查询中同时展示「结算状态」与「合同状态」，点击详情可查看对应的结算单据与电子合同。
      </p>
    </div>
  )
}
