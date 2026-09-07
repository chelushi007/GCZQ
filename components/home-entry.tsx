import { Factory, Recycle, Truck, ArrowRight } from "lucide-react"

const roles = [
  { icon: Factory, title: "钢厂", desc: "发布采购需求，管理供应商", tone: "bg-primary/10 text-primary" },
  { icon: Recycle, title: "回收站", desc: "供货 / 出售 / 采购废钢，申请合作", tone: "bg-emerald-50 text-emerald-600" },
  { icon: Truck, title: "供应商", desc: "企业与自然人，供货及买卖废钢", tone: "bg-amber-50 text-amber-600" },
]

export function HomeEntry() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">前台 · 首页入口</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          钢厂专区作为盘古循环资源平台前台的一级入口，用户从门户进入对应角色工作台。
        </p>
      </div>

      {/* 门户截图 */}
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2 text-xs text-muted-foreground">
          <span className="size-2.5 rounded-full bg-red-400" />
          <span className="size-2.5 rounded-full bg-amber-400" />
          <span className="size-2.5 rounded-full bg-emerald-400" />
          <span className="ml-2">盘古循环资源 · 门户首页（导航含「钢厂专区」入口）</span>
        </div>
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-FPvl9vttJz77KMwjFJ9lKnfGPONgr4.png"
          alt="盘古循环资源门户首页，导航栏包含钢厂专区入口"
          className="w-full"
        />
      </div>

      {/* 角色入口 */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">进入工作台 · 选择角色</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {roles.map((r) => {
            const Icon = r.icon
            return (
              <div
                key={r.title}
                className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40"
              >
                <div className={`flex size-11 items-center justify-center rounded-lg ${r.tone}`}>
                  <Icon className="size-5" />
                </div>
                <p className="mt-3 text-base font-semibold text-foreground">{r.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  进入工作台
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
