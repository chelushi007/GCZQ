"use client"

import { useMemo, useState } from "react"
import { Search, RotateCcw, FileSearch, HandCoins, CheckCircle2, Info, ArrowLeft, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, FilterBar, FilterChip, type Column } from "@/components/shared/data-table"
import { StatusPill } from "@/components/shared/status-pill"
import { Modal } from "@/components/shared/modal"
import { supplierFixedList, supplierFixedStatusTone, type SupplierFixedItem } from "@/lib/steel-data"

const categories = ["全部类别", "重废", "统废", "生铁"]
const regions = ["全部区域", "江苏·南京", "江苏·苏州", "江苏·无锡", "安徽·马鞍山"]

/* ---------------- 一口价大厅 ---------------- */
function FixedHall({ onTake }: { onTake: (i: SupplierFixedItem) => void }) {
  const [category, setCategory] = useState("全部类别")
  const [region, setRegion] = useState("全部区域")
  const [keyword, setKeyword] = useState("")
  // 一口价大厅：仅展示仍可接单的挂单
  const source = supplierFixedList.filter((f) => f.myStatus === "可接单" || f.myStatus === "待确认")

  const rows = useMemo(
    () =>
      source.filter((f) => {
        if (category !== "全部类别" && f.category !== category) return false
        if (region !== "全部区域" && f.region !== region) return false
        if (keyword && !`${f.id}${f.title}${f.buyer}`.toLowerCase().includes(keyword.toLowerCase())) return false
        return true
      }),
    [category, region, keyword, source],
  )

  const columns: Column<SupplierFixedItem>[] = [
    { key: "id", header: "挂单编号", className: "whitespace-nowrap font-medium text-foreground" },
    { key: "title", header: "挂单标题", className: "whitespace-nowrap" },
    { key: "buyer", header: "采购单位", className: "whitespace-nowrap" },
    { key: "category", header: "类别", className: "whitespace-nowrap", render: (r) => <StatusPill tone="gray">{r.category}</StatusPill> },
    { key: "region", header: "区域", className: "whitespace-nowrap text-muted-foreground" },
    { key: "price", header: "一口价", className: "whitespace-nowrap tabular-nums font-medium text-primary" },
    { key: "planQty", header: "计划采购量", className: "whitespace-nowrap tabular-nums" },
    { key: "remainQty", header: "剩余可接量", className: "whitespace-nowrap tabular-nums font-medium text-foreground" },
    { key: "validUntil", header: "有效期至", className: "whitespace-nowrap tabular-nums text-muted-foreground" },
    {
      key: "myStatus",
      header: "接单状态",
      className: "whitespace-nowrap",
      render: (r) => <StatusPill tone={supplierFixedStatusTone[r.myStatus]}>{r.myStatus}</StatusPill>,
    },
    {
      key: "op",
      header: "操作",
      className: "whitespace-nowrap",
      render: (r) =>
        r.myStatus === "可接单" ? (
          <Button size="sm" onClick={() => onTake(r)}>
            <HandCoins />
            立即接单
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={() => onTake(r)}>
            <FileSearch />
            查看
          </Button>
        ),
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm text-foreground">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>一口价（固定价）交易由采购方设定统一收购价，供应商按价接单报量，无需缴纳报名费与保证金，接单经采购方确认后即成交送货。</p>
      </div>
      <FilterCard
        category={category}
        setCategory={setCategory}
        region={region}
        setRegion={setRegion}
        keyword={keyword}
        setKeyword={setKeyword}
        onReset={() => {
          setCategory("全部类别")
          setRegion("全部区域")
          setKeyword("")
        }}
      />
      <p className="text-sm text-muted-foreground">
        共 <span className="font-medium text-foreground tabular-nums">{rows.length}</span> 条可接一口价挂单
      </p>
      <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} stickyLastColumn />
    </div>
  )
}

/* ---------------- 我的接单 ---------------- */
const myTabs = ["全部", "待确认", "已成交", "已拒绝"]

function MyTaken({ onOpen }: { onOpen: (i: SupplierFixedItem) => void }) {
  const [tab, setTab] = useState("全部")
  const [keyword, setKeyword] = useState("")
  // 我的接单：已接单（非“可接单”）的记录
  const source = supplierFixedList.filter((f) => f.myStatus !== "可接单")

  const rows = useMemo(
    () =>
      source.filter((f) => {
        if (tab !== "全部" && f.myStatus !== tab) return false
        if (keyword && !`${f.id}${f.title}${f.buyer}`.toLowerCase().includes(keyword.toLowerCase())) return false
        return true
      }),
    [tab, keyword, source],
  )

  const columns: Column<SupplierFixedItem>[] = [
    { key: "id", header: "挂单编号", className: "whitespace-nowrap font-medium text-foreground" },
    { key: "title", header: "挂单标题", className: "whitespace-nowrap" },
    { key: "buyer", header: "采购单位", className: "whitespace-nowrap" },
    { key: "category", header: "类别", className: "whitespace-nowrap", render: (r) => <StatusPill tone="gray">{r.category}</StatusPill> },
    { key: "price", header: "一口价", className: "whitespace-nowrap tabular-nums font-medium text-primary" },
    { key: "myTakenQty", header: "我的接单量", className: "whitespace-nowrap tabular-nums font-medium text-foreground" },
    { key: "validUntil", header: "有效期至", className: "whitespace-nowrap tabular-nums text-muted-foreground" },
    {
      key: "myStatus",
      header: "接单状态",
      className: "whitespace-nowrap",
      render: (r) => <StatusPill tone={supplierFixedStatusTone[r.myStatus]}>{r.myStatus}</StatusPill>,
    },
    {
      key: "op",
      header: "操作",
      className: "whitespace-nowrap",
      render: (r) => (
        <Button variant="outline" size="sm" onClick={() => onOpen(r)}>
          <FileSearch />
          查看详情
        </Button>
      ),
    },
  ]

  const totalTaken = source.length
  const dealCount = source.filter((f) => f.myStatus === "已成交").length
  const pendingCount = source.filter((f) => f.myStatus === "待确认").length

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="累计接单" value={String(totalTaken)} unit="笔" tone="primary" />
        <StatCard label="待采购方确认" value={String(pendingCount)} unit="笔" tone="amber" />
        <StatCard label="已成交" value={String(dealCount)} unit="笔" tone="green" />
      </div>
      <div className="rounded-lg border border-border bg-card p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <FilterBar>
            {myTabs.map((t) => (
              <FilterChip key={t} active={tab === t} onClick={() => setTab(t)}>
                {t}
              </FilterChip>
            ))}
          </FilterBar>
          <div className="flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm focus-within:border-primary">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索编号 / 标题 / 采购单位"
              className="w-56 bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        共 <span className="font-medium text-foreground tabular-nums">{rows.length}</span> 条接单记录
      </p>
      <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} stickyLastColumn />
    </div>
  )
}

/* ---------------- 接单弹窗 ---------------- */
function TakeModal({ item, onClose }: { item: SupplierFixedItem; onClose: () => void }) {
  const [qty, setQty] = useState("")
  const [done, setDone] = useState(false)
  const readonly = item.myStatus !== "可接单"

  return (
    <Modal
      open
      onClose={onClose}
      title={readonly ? "接单详情" : "一口价接单"}
      description={`${item.id} · ${item.title}`}
      size="md"
      footer={
        done ? (
          <Button onClick={onClose}>完成</Button>
        ) : readonly ? (
          <Button variant="outline" onClick={onClose}>关闭</Button>
        ) : (
          <>
            <Button variant="outline" onClick={onClose}>取消</Button>
            <Button disabled={!qty || Number(qty) <= 0} onClick={() => setDone(true)}>
              <HandCoins />
              确认接单
            </Button>
          </>
        )
      }
    >
      {done ? (
        <div className="flex flex-col items-center py-6 text-center">
          <CheckCircle2 className="size-12 text-emerald-500" />
          <p className="mt-3 font-medium text-foreground">接单已提交</p>
          <p className="mt-1 text-sm text-muted-foreground">
            已按一口价 {item.price} 接单 {qty} 吨，等待采购方 {item.buyer} 确认，确认后即成交送货。
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <Field label="采购单位" value={item.buyer} />
            <Field label="物料类别" value={item.category} />
            <Field label="一口价" value={item.price} strong />
            <Field label="剩余可接量" value={item.remainQty} strong />
            <Field label="所在区域" value={item.region} />
            <Field label="有效期至" value={item.validUntil} />
          </dl>
          {readonly ? (
            <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">我的接单量</span>
                <span className="font-medium text-foreground tabular-nums">{item.myTakenQty}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-muted-foreground">接单状态</span>
                <StatusPill tone={supplierFixedStatusTone[item.myStatus]}>{item.myStatus}</StatusPill>
              </div>
            </div>
          ) : (
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground">接单数量（吨）</span>
              <input
                value={qty}
                onChange={(e) => setQty(e.target.value.replace(/[^\d.]/g, ""))}
                inputMode="decimal"
                placeholder="请输入本次接单数量"
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary"
              />
              <span className="text-xs text-muted-foreground">按采购方设定的一口价 {item.price} 成交，无需缴纳报名费与保证金。</span>
            </label>
          )}
        </div>
      )}
    </Modal>
  )
}

/* ---------------- 接单详情（我的接单） ---------------- */
function TakenDetail({ item, onBack }: { item: SupplierFixedItem; onBack: () => void }) {
  const steps = [
    { label: "浏览挂单", done: true },
    { label: "接单报量", done: true },
    { label: "采购方确认", done: item.myStatus === "已成交" || item.myStatus === "已拒绝", active: item.myStatus === "待确认" },
    { label: item.myStatus === "已拒绝" ? "已拒绝" : "成交送货结算", done: item.myStatus === "已成交", reject: item.myStatus === "已拒绝" },
  ]

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" />
        返回我的接单
      </button>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{item.title}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">{item.id} · {item.buyer}</p>
          </div>
          <StatusPill tone={supplierFixedStatusTone[item.myStatus]}>{item.myStatus}</StatusPill>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
          <Field label="物料类别" value={item.category} />
          <Field label="一口价" value={item.price} strong />
          <Field label="我的接单量" value={item.myTakenQty} strong />
          <Field label="所在区域" value={item.region} />
          <Field label="有效期至" value={item.validUntil} />
          <Field label="发布时间" value={item.publishTime} />
        </dl>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground">接单进度</h3>
        <ol className="mt-4 flex flex-wrap items-center gap-2">
          {steps.map((s, i) => (
            <li key={s.label} className="flex items-center gap-2">
              <span
                className={`flex size-7 items-center justify-center rounded-full text-xs font-medium ${
                  s.reject
                    ? "bg-muted text-muted-foreground"
                    : s.done
                      ? "bg-emerald-500 text-white"
                      : s.active
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                }`}
              >
                {s.done ? <CheckCircle2 className="size-4" /> : i + 1}
              </span>
              <span className={`text-sm ${s.done || s.active ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
              {i < steps.length - 1 && <span className="mx-1 h-px w-6 bg-border" />}
            </li>
          ))}
        </ol>
        {item.myStatus === "已成交" && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm text-foreground">
            <Truck className="size-4 shrink-0 text-emerald-600" />
            采购方已确认接单，请按约定时间送货，送货验收后进入结算流程。
          </div>
        )}
        {item.myStatus === "待确认" && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-foreground">
            <Info className="size-4 shrink-0 text-amber-600" />
            接单已提交，等待采购方 {item.buyer} 确认成交数量。
          </div>
        )}
        {item.myStatus === "已拒绝" && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
            <Info className="size-4 shrink-0" />
            本次接单未被采购方确认（可能因计划量已满或资质不符），可在大厅重新选择其他挂单。
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------------- 通用小组件 ---------------- */
function Field({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={`mt-0.5 ${strong ? "font-medium text-primary tabular-nums" : "text-foreground"}`}>{value}</dd>
    </div>
  )
}

function StatCard({ label, value, unit, tone }: { label: string; value: string; unit: string; tone: "primary" | "amber" | "green" }) {
  const toneCls = { primary: "text-primary", amber: "text-amber-600", green: "text-emerald-600" }[tone]
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-1.5 text-2xl font-semibold ${toneCls}`}>
        {value}
        {unit && <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>}
      </p>
    </div>
  )
}

function FilterCard({
  category,
  setCategory,
  region,
  setRegion,
  keyword,
  setKeyword,
  onReset,
}: {
  category: string
  setCategory: (v: string) => void
  region: string
  setRegion: (v: string) => void
  keyword: string
  setKeyword: (v: string) => void
  onReset: () => void
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">物料类别</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">区域范围</span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary"
          >
            {regions.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5 lg:col-span-2">
          <span className="text-xs font-medium text-muted-foreground">关键词</span>
          <div className="flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm focus-within:border-primary">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索挂单编号 / 标题 / 采购单位"
              className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </div>
        </label>
      </div>
      <div className="mt-4 flex justify-end border-t border-border pt-4">
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw />
          重置
        </Button>
      </div>
    </div>
  )
}

/* ---------------- 入口 ---------------- */
export function SupplierFixed({ leaf }: { leaf: string }) {
  const [takeItem, setTakeItem] = useState<SupplierFixedItem | null>(null)
  const [detailItem, setDetailItem] = useState<SupplierFixedItem | null>(null)

  if (leaf === "station-supplier-fixed-mine" && detailItem) {
    return <TakenDetail item={detailItem} onBack={() => setDetailItem(null)} />
  }

  return (
    <>
      {leaf === "station-supplier-fixed-hall" && <FixedHall onTake={setTakeItem} />}
      {leaf === "station-supplier-fixed-mine" && <MyTaken onOpen={setDetailItem} />}
      {takeItem && <TakeModal item={takeItem} onClose={() => setTakeItem(null)} />}
    </>
  )
}
