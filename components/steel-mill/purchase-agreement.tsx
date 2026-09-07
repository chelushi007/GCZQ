"use client"

import { useState } from "react"
import { Plus, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { StatusPill, statusTone } from "@/components/shared/status-pill"
import { DataTable, FilterBar, FilterChip, type Column } from "@/components/shared/data-table"
import { agreementList, type AgreementItem } from "@/lib/steel-data"

const tabs = ["全部", "履约中", "待签署", "已到期"]

export function PurchaseAgreement() {
  const [tab, setTab] = useState("全部")
  const rows = tab === "全部" ? agreementList : agreementList.filter((b) => b.status === tab)

  const columns: Column<AgreementItem>[] = [
    { key: "id", header: "协议编号", render: (r) => <span className="font-medium text-foreground">{r.id}</span> },
    { key: "supplier", header: "供应商", render: (r) => <span className="font-medium text-foreground">{r.supplier}</span> },
    { key: "category", header: "废钢类别", render: (r) => <StatusPill tone="gray">{r.category}</StatusPill> },
    { key: "monthlyQty", header: "约定供货量" },
    { key: "price", header: "定价方式", render: (r) => <span className="text-primary">{r.price}</span> },
    { key: "period", header: "协议期限", className: "text-muted-foreground" },
    { key: "status", header: "状态", render: (r) => <StatusPill tone={statusTone(r.status)}>{r.status}</StatusPill> },
    {
      key: "op",
      header: "操作",
      render: () => (
        <Button variant="ghost" size="sm">
          <FileText />
          协议
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <PageHeader
        title="协议回收"
        desc="与优质供应商签订长期采购协议，锁定货源与价格机制，稳定履约"
        action={
          <Button>
            <Plus />
            新建采购协议
          </Button>
        }
      />

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
