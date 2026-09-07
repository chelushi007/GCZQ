"use client"

import { useState } from "react"
import { Plus, Search, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { StatusPill, statusTone } from "@/components/shared/status-pill"
import { DataTable, FilterBar, FilterChip, type Column } from "@/components/shared/data-table"
import { biddingList, type BiddingItem } from "@/lib/steel-data"

const tabs = ["全部", "进行中", "待开标", "已成交", "已流标"]

export function PurchaseBidding() {
  const [tab, setTab] = useState("全部")
  const rows = tab === "全部" ? biddingList : biddingList.filter((b) => b.status === tab)

  const columns: Column<BiddingItem>[] = [
    { key: "id", header: "竞价单号", render: (r) => <span className="font-medium text-foreground">{r.id}</span> },
    { key: "title", header: "标的名称" },
    { key: "category", header: "废钢类别", render: (r) => <StatusPill tone="gray">{r.category}</StatusPill> },
    { key: "qty", header: "数量" },
    { key: "basePrice", header: "起拍价" },
    {
      key: "quotes",
      header: "报价数",
      render: (r) => <span className="tabular-nums">{r.quotes} 条</span>,
    },
    {
      key: "topQuote",
      header: "当前最高价",
      render: (r) => <span className="font-medium text-primary">{r.topQuote}</span>,
    },
    { key: "deadline", header: "截止时间", className: "text-muted-foreground" },
    { key: "status", header: "状态", render: (r) => <StatusPill tone={statusTone(r.status)}>{r.status}</StatusPill> },
    {
      key: "op",
      header: "操作",
      render: () => (
        <Button variant="ghost" size="sm">
          <Eye />
          详情
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <PageHeader
        title="竞价回收"
        desc="发布竞价采购需求，供应商在线报价，价高（低）者得，公开透明"
        action={
          <Button>
            <Plus />
            发布竞价需求
          </Button>
        }
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
            placeholder="搜索竞价单号 / 标的"
            className="w-44 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} />
    </div>
  )
}
