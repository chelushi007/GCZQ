"use client"

import { useState } from "react"
import {
  Search,
  MapPin,
  ChevronDown,
  Megaphone,
  Gavel,
  Tag,
  Clock,
  Flame,
  ArrowRight,
  Receipt,
  Truck,
  Scale,
  Wallet,
  ShieldCheck,
  Leaf,
  X,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  listingsByChannel,
  zoneDeals,
  zoneNews,
  featuredServices,
  partnerCompanies,
  scrapCategories,
  type Channel,
  type Listing,
} from "@/lib/steel-zone-data"
import { ZoneBanner } from "./steel-zone/zone-banner"
import { DemandDistribution, SectionTitle } from "./steel-zone/demand-distribution"
import { NetworkDistribution } from "./steel-zone/network-distribution"

const topNav = ["首页", "废钢需求", "竞价大厅", "废钢采购", "废钢销售", "成交公告", "资讯服务", "特色服务"]

export function SteelZoneChannel() {
  const [publishOpen, setPublishOpen] = useState(false)

  return (
    <div className="min-h-full bg-background pb-16">
      {/* 频道顶部导航 */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-6 border-b border-border bg-card/95 px-8 backdrop-blur">
        <div className="flex shrink-0 items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            钢
          </span>
          <span className="text-base font-bold text-foreground">钢厂专区</span>
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">CHANNEL</span>
        </div>
        <nav className="flex flex-1 items-center gap-5 text-sm">
          {topNav.map((t, i) => (
            <button
              key={t}
              className={cn(
                "whitespace-nowrap py-1 transition-colors",
                i === 0 ? "font-semibold text-primary" : "text-foreground/75 hover:text-primary",
              )}
            >
              {t}
            </button>
          ))}
        </nav>
        <button
          onClick={() => setPublishOpen(true)}
          className="flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Megaphone className="size-4" />
          发布回收需求
        </button>
      </header>

      {/* 1. Banner 轮播 */}
      <ZoneBanner />

      {/* 2. 搜索引擎 */}
      <div className="relative z-10 mx-auto -mt-8 max-w-4xl px-6">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-lg">
          <button className="flex shrink-0 items-center gap-1.5 px-2 text-sm font-medium text-foreground">
            <MapPin className="size-4 text-primary" />
            全国
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </button>
          <span className="h-6 w-px bg-border" />
          <button className="flex shrink-0 items-center gap-1.5 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
            废钢分类 <ChevronDown className="size-3.5" />
          </button>
          <input
            placeholder="搜索废钢品类、回收 / 销售需求、回收商…"
            className="min-w-0 flex-1 bg-transparent px-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button className="flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            <Search className="size-4" />
            搜索
          </button>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 px-2 text-xs text-muted-foreground">
          <span>热门：</span>
          {scrapCategories.slice(1, 7).map((c) => (
            <button key={c.key} className="hover:text-primary">
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* 3. 废钢需求分布（三级联动地图） */}
      <DemandDistribution onPublish={() => setPublishOpen(true)} />

      {/* 3. 回收网点分布（地图联动） */}
      <NetworkDistribution />

      {/* 4. 竞价大厅 */}
      <BiddingHall />

      {/* 5. 废钢采购 */}
      <ScrapPurchase />

      {/* 6. 废钢销售 */}
      <ScrapSales />

      {/* 7 & 8. 成交公告 + 资讯服务 */}
      <section className="mx-auto grid max-w-6xl gap-5 px-6 lg:grid-cols-[1fr_1.3fr]">
        <DealAnnouncements />
        <NewsService />
      </section>

      {/* 9. 特色服务 */}
      <FeaturedServices />

      {/* 10. 合作企业 */}
      <PartnerCompanies />

      {publishOpen && <PublishDemandModal onClose={() => setPublishOpen(false)} />}
    </div>
  )
}

/* ------------------------- 竞价大厅 ------------------------- */
function BiddingHall() {
  const tabs: { key: Channel; label: string }[] = [
    { key: "竞价回收", label: "竞价回收" },
    { key: "竞价销售", label: "竞价销售" },
  ]
  const [tab, setTab] = useState<Channel>("竞价回收")
  const items = listingsByChannel(tab)

  return (
    <section className="mx-auto max-w-6xl px-6">
      <SectionTitle title="竞价大厅" sub="阳光竞价 · 实时报价 · 公开透明" />
      <div className="mb-4 inline-flex rounded-lg border border-border bg-card p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
              tab === t.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.key === "竞价回收" ? <Gavel className="size-4" /> : <Flame className="size-4" />}
            {t.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <AuctionCard key={it.id} item={it} />
        ))}
      </div>
    </section>
  )
}

function AuctionCard({ item }: { item: Listing }) {
  const live = item.status === "竞价中"
  return (
    <div className="group flex flex-col rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md">
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "rounded px-1.5 py-0.5 text-[10px] font-medium",
            live ? "bg-primary/10 text-primary" : "bg-amber-50 text-amber-600",
          )}
        >
          {item.status}
        </span>
        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{item.category}</span>
      </div>
      <h3 className="mt-2 line-clamp-2 min-h-10 text-sm font-medium text-foreground">{item.title}</h3>
      <div className="mt-2 flex items-end justify-between">
        <div>
          <span className="text-lg font-bold text-primary">{item.price.toLocaleString()}</span>
          <span className="ml-0.5 text-[11px] text-muted-foreground">{item.unit}</span>
        </div>
        <span className="text-[11px] text-muted-foreground">{item.quantity}</span>
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="size-3" />
          {item.region}
        </span>
        {live ? (
          <span className="flex items-center gap-1 font-medium text-destructive">
            <Clock className="size-3" />
            {item.endsIn}
          </span>
        ) : (
          <span>{item.endsIn}</span>
        )}
      </div>
      <button className="mt-3 w-full rounded-md bg-primary/10 py-1.5 text-xs font-medium text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        {live ? `立即参与（${item.bids} 次出价）` : "查看详情"}
      </button>
    </div>
  )
}

/* ------------------------- 废钢采购 ------------------------- */
function ScrapPurchase() {
  const channels: Channel[] = ["竞价回收", "固定价回收", "竞价销售", "固定价销售"]
  const [tab, setTab] = useState<Channel>("竞价回收")
  const items = listingsByChannel(tab)

  return (
    <section className="mx-auto max-w-6xl px-6">
      <SectionTitle title="废钢采购" sub="竞价回收 · 固定价回收 · 竞价销售 · 固定价销售" />
      <div className="mb-4 flex flex-wrap gap-2">
        {channels.map((c) => (
          <button
            key={c}
            onClick={() => setTab(c)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              tab === c
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left text-xs text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">标的名称</th>
              <th className="px-4 py-2.5 font-medium">品类</th>
              <th className="px-4 py-2.5 font-medium">规格</th>
              <th className="px-4 py-2.5 font-medium">数量</th>
              <th className="px-4 py-2.5 text-right font-medium">价格</th>
              <th className="px-4 py-2.5 font-medium">地区</th>
              <th className="px-4 py-2.5 font-medium">发布方</th>
              <th className="px-4 py-2.5 text-center font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                <td className="max-w-56 truncate px-4 py-3 font-medium text-foreground">{it.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{it.category}</td>
                <td className="px-4 py-3 text-muted-foreground">{it.spec}</td>
                <td className="px-4 py-3 text-muted-foreground">{it.quantity}</td>
                <td className="px-4 py-3 text-right font-semibold text-primary">
                  {it.price.toLocaleString()}
                  <span className="text-[11px] font-normal text-muted-foreground"> {it.unit}</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{it.region}</td>
                <td className="px-4 py-3 text-muted-foreground">{it.company}</td>
                <td className="px-4 py-3 text-center">
                  <button className="rounded-md bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
                    {it.channel.startsWith("竞价") ? "参与竞价" : "立即交易"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

/* ------------------------- 废钢销售 ------------------------- */
function ScrapSales() {
  const items = [...listingsByChannel("竞价销售"), ...listingsByChannel("固定价销售")]
  return (
    <section className="mx-auto max-w-6xl px-6">
      <SectionTitle title="废钢销售" sub="钢厂副产品与废旧金属对外销售" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <div
            key={it.id}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
          >
            <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Tag className="size-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 text-[10px] font-medium",
                    it.channel === "竞价销售" ? "bg-primary/10 text-primary" : "bg-emerald-50 text-emerald-600",
                  )}
                >
                  {it.channel}
                </span>
                <span className="truncate text-[11px] text-muted-foreground">{it.category}</span>
              </div>
              <p className="mt-1 line-clamp-1 text-sm font-medium text-foreground">{it.title}</p>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-base font-bold text-emerald-600">
                  {it.price.toLocaleString()}
                  <span className="text-[11px] font-normal text-muted-foreground"> {it.unit}</span>
                </span>
                <span className="text-[11px] text-muted-foreground">{it.quantity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ------------------------- 成交公告 ------------------------- */
function DealAnnouncements() {
  return (
    <div>
      <SectionTitle title="成交公告" />
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <ul className="divide-y divide-border">
          {zoneDeals.map((d) => (
            <li key={d.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40">
              <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600">已成交</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{d.title}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {d.category} · {d.weight} · {d.region}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-primary">{d.price}</p>
                <p className="text-[11px] text-muted-foreground">{d.date}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* ------------------------- 资讯服务 ------------------------- */
function NewsService() {
  const [featured, ...rest] = zoneNews
  return (
    <div>
      <SectionTitle title="资讯服务" sub="废钢行情 · 钢铁行业动态 · 政策法规" />
      <div className="grid gap-4 sm:grid-cols-[1.1fr_1fr]">
        <div className="rounded-xl border border-border bg-card p-4">
          <span className="rounded bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">{featured.tag}</span>
          <h3 className="mt-2 text-pretty text-base font-semibold leading-snug text-foreground">{featured.title}</h3>
          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{featured.summary}</p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{featured.date}</span>
            <button className="flex items-center gap-1 text-primary hover:underline">
              阅读全文 <ArrowRight className="size-3" />
            </button>
          </div>
        </div>
        <ul className="divide-y divide-border rounded-xl border border-border bg-card px-4">
          {rest.map((n) => (
            <li key={n.id} className="py-2.5 first:pt-3 last:pb-3">
              <button className="group block w-full text-left">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{n.tag}</span>
                  <span className="ml-auto text-[11px] text-muted-foreground">{n.date}</span>
                </div>
                <p className="mt-1 line-clamp-1 text-[13px] text-foreground/90 group-hover:text-primary">{n.title}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* ------------------------- 特色服务 ------------------------- */
const serviceIcon: Record<string, LucideIcon> = {
  receipt: Receipt,
  truck: Truck,
  scale: Scale,
  wallet: Wallet,
  shield: ShieldCheck,
  leaf: Leaf,
}

function FeaturedServices() {
  return (
    <section className="mx-auto max-w-6xl px-6">
      <SectionTitle title="特色服务" sub="全链路增值服务 · 让废钢交易更省心" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {featuredServices.map((s) => {
          const Icon = serviceIcon[s.icon] ?? ShieldCheck
          return (
            <div
              key={s.key}
              className="group flex flex-col items-center rounded-xl border border-border bg-card p-4 text-center transition-colors hover:border-primary/50"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-5" />
              </span>
              <p className="mt-2.5 text-sm font-medium text-foreground">{s.title}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ------------------------- 合作企业 ------------------------- */
function PartnerCompanies() {
  return (
    <section className="mx-auto max-w-6xl px-6">
      <SectionTitle title="合作企业" sub="携手行业龙头 共建循环生态" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {partnerCompanies.map((p) => (
          <div
            key={p}
            className="flex h-16 items-center justify-center rounded-lg border border-border bg-card px-3 text-center text-sm font-medium text-foreground/80 transition-colors hover:border-primary/40 hover:text-primary"
          >
            {p}
          </div>
        ))}
      </div>
    </section>
  )
}

/* ------------------------- 发布回收需求 弹窗 ------------------------- */
function PublishDemandModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-label="发布回收需求"
        className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Megaphone className="size-4 text-primary" />
            发布回收需求
          </h3>
          <button onClick={onClose} aria-label="关闭" className="text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <ShieldCheck className="size-6" />
            </div>
            <p className="text-sm font-medium text-foreground">需求已发布</p>
            <p className="text-xs text-muted-foreground">平台将为您匹配区域内认证回收商，请留意工作台通知。</p>
            <button
              onClick={onClose}
              className="mt-3 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              完成
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <Field label="废钢品类">
              <select className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
                {scrapCategories.slice(1).map((c) => (
                  <option key={c.key}>{c.name}</option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="需求数量（吨）">
                <input
                  type="number"
                  placeholder="如 1000"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                />
              </Field>
              <Field label="意向价格（元/吨）">
                <input
                  type="number"
                  placeholder="如 2600"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                />
              </Field>
            </div>
            <Field label="交货地区">
              <input
                placeholder="如 河北·唐山"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            </Field>
            <Field label="规格 / 备注">
              <textarea
                rows={3}
                placeholder="请填写规格要求、质量标准、验质方式等"
                className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            </Field>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={onClose}
                className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
              >
                取消
              </button>
              <button
                onClick={() => setSubmitted(true)}
                className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                发布需求
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-foreground">{label}</span>
      {children}
    </label>
  )
}
