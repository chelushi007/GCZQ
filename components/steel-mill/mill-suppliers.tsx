"use client"

import { useState } from "react"
import { UserPlus, CheckCircle2, Ban } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { StatusPill, statusTone } from "@/components/shared/status-pill"
import { DataTable, FilterBar, FilterChip, type Column } from "@/components/shared/data-table"
import { supplierList, type SupplierItem } from "@/lib/steel-data"

const tabs = ["全部", "回收站", "企业供应商", "自然人"]
const typeTone: Record<string, "blue" | "green" | "amber"> = {
  回收站: "blue",
  企业供应商: "green",
  自然人: "amber",
}

export function MillSuppliers() {
  const [tab, setTab] = useState("全部")
  const rows = tab === "全部" ? supplierList : supplierList.filter((s) => s.type === tab)

  const columns: Column<SupplierItem>[] = [
    { key: "name", header: "供应商名称", render: (r) => <span className="font-medium text-foreground">{r.name}</span> },
    { key: "type", header: "类型", render: (r) => <StatusPill tone={typeTone[r.type]}>{r.type}</StatusPill> },
    {
      key: "cooperation",
      header: "合作等级",
      render: (r) =>
        r.cooperation === "协议供应商" ? (
          <StatusPill tone="violet">协议供应商</StatusPill>
        ) : (
          <span className="text-muted-foreground">普通供应商</span>
        ),
    },
    { key: "contact", header: "联系人", className: "text-muted-foreground" },
    { key: "region", header: "所在地区" },
    { key: "supplyCategory", header: "供货类别" },
    { key: "totalQty", header: "累计供货", render: (r) => <span className="tabular-nums">{r.totalQty}</span> },
    { key: "status", header: "状态", render: (r) => <StatusPill tone={statusTone(r.status)}>{r.status}</StatusPill> },
    {
      key: "op",
      header: "操作",
      render: (r) =>
        r.status === "待审核" ? (
          <Button size="sm">
            <CheckCircle2 />
            审核
          </Button>
        ) : (
          <Button variant="ghost" size="sm">
            {r.status === "已停用" ? <Ban /> : null}
            详情
          </Button>
        ),
    },
  ]

  const stats = [
    { label: "合作供应商", value: supplierList.filter((s) => s.status === "合作中").length },
    { label: "待审核申请", value: supplierList.filter((s) => s.status === "待审核").length },
    { label: "协议供应商", value: supplierList.filter((s) => s.cooperation === "协议供应商").length },
    { label: "自然人供应商", value: supplierList.filter((s) => s.type === "自然人").length },
  ]

  return (
    <div className="space-y-5">
      <PageHeader
        title="供应商管理"
        desc="管理回收站、企业与自然人供应商，审核合作申请，维护协议合作关系"
        action={
          <Button>
            <UserPlus />
            邀请供应商
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-card px-4 py-3">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-xl font-semibold text-foreground tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>

      <FilterBar>
        {tabs.map((t) => (
          <FilterChip key={t} active={tab === t} onClick={() => setTab(t)}>
            {t}
          </FilterChip>
        ))}
      </FilterBar>

      <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} />
    </div>
  )
}
