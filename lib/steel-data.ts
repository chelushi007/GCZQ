// 钢厂专区工作台 - 静态原型数据

export type WorkspaceKey =
  | "portal-home"
  | "portal-steel"
  | "mill"
  | "station"
  | "supplier"
  | "ops-tbd"

export interface NavLeaf {
  key: WorkspaceKey
  label: string
  desc?: string
}

export interface NavGroup {
  id: string
  label: string
  children: NavLeaf[]
}

// 中间栏「钢厂专区」菜单：前台 / 用户工作台 / 运营工作台
export const workspaceNav: NavGroup[] = [
  {
    id: "portal",
    label: "门户",
    children: [
      { key: "portal-home", label: "首页", desc: "盘古循环资源" },
      { key: "portal-steel", label: "钢厂专区", desc: "专区工作台" },
    ],
  },
  {
    id: "user",
    label: "用户工作台",
    children: [
      { key: "mill", label: "钢厂", desc: "采购方" },
      { key: "station", label: "回收站", desc: "供货 / 采购" },
      { key: "supplier", label: "供应商", desc: "企业 / 自然人" },
    ],
  },
  {
    id: "ops",
    label: "运营工作台",
    children: [{ key: "ops-tbd", label: "待定", desc: "规划中" }],
  },
]

// 最左侧「钢厂专区设计稿」导航（原型索引）
export const designNav: { key: WorkspaceKey; label: string }[] = [
  { key: "portal-home", label: "门户 · 首页" },
  { key: "portal-steel", label: "门户 · 钢厂专区" },
  { key: "mill", label: "工作台 · 钢厂" },
  { key: "station", label: "工作台 · 回收站" },
  { key: "supplier", label: "工作台 · 供应商" },
  { key: "ops-tbd", label: "运营工作台" },
]

// ---------- 钢厂工作台内部菜单 ----------
export type MillMenuKey =
  | "overview"
  | "purchase-bidding"
  | "purchase-fixed"
  | "purchase-agreement"
  | "orders"
  | "suppliers"

// ---------- 回收站工作台树形菜单（可多层嵌套） ----------
export interface StationTreeNode {
  key: string
  label: string
  children?: StationTreeNode[]
}

// 回收站下级：供应商 / 回收商 / 销售方
// 其中「供应商」下含「竞价管理」，竞价管理展开含五个业务项
export const stationTree: StationTreeNode[] = [
  {
    key: "station-supplier",
    label: "供应商",
    children: [
      {
        key: "station-supplier-bidding",
        label: "竞价管理",
        children: [
          { key: "station-supplier-bidding-signup", label: "网上报名" },
          { key: "station-supplier-bidding-mine", label: "我的竞价" },
          { key: "station-supplier-bidding-fee", label: "缴纳报名费" },
          { key: "station-supplier-bidding-deposit", label: "缴纳保证金" },
          { key: "station-supplier-bidding-service", label: "缴纳服务费" },
        ],
      },
    ],
  },
  {
    key: "station-recycler",
    label: "回收商",
  },
  {
    key: "station-seller",
    label: "销售方",
  },
]

// 回收站叶子节点 -> 面包屑路径（父级链），用于内容页标题与面包屑
export const stationLeafPath: Record<string, string[]> = {
  "station-supplier-bidding-signup": ["供应商", "竞价管理", "网上报名"],
  "station-supplier-bidding-mine": ["供应商", "竞价管理", "我的竞价"],
  "station-supplier-bidding-fee": ["供应商", "竞价管理", "缴纳报名费"],
  "station-supplier-bidding-deposit": ["供应商", "竞价管理", "缴纳保证金"],
  "station-supplier-bidding-service": ["供应商", "竞价管理", "缴纳服务费"],
  "station-recycler": ["回收商"],
  "station-seller": ["销售方"],
}

// ---------- 概览统计 ----------
export const overviewStats = [
  { label: "进行中采购需求", value: "18", unit: "单", trend: "+3", tone: "primary" },
  { label: "待处理报价", value: "42", unit: "条", trend: "+12", tone: "amber" },
  { label: "本月采购量", value: "6,820", unit: "吨", trend: "+8.4%", tone: "green" },
  { label: "合作供应商", value: "56", unit: "家", trend: "+2", tone: "violet" },
] as const

export const purchaseChannelStats = [
  { name: "竞价回收", count: 8, amount: "3,120 吨" },
  { name: "固定价回收", count: 6, amount: "2,050 吨" },
  { name: "协议回收", count: 4, amount: "1,650 吨" },
]

export const recentActivities = [
  { time: "10:24", text: "竞价单 JJ20260907-003 收到「华东再生」报价 ¥2,650/吨", type: "报价" },
  { time: "09:50", text: "固定价单 GD20260907-011 已被「城南回收站」接单", type: "接单" },
  { time: "09:12", text: "协议单 XY20260906-002 结算单待确认", type: "结算" },
  { time: "昨天", text: "新供应商「盛通金属」提交合作申请，待审核", type: "审核" },
  { time: "昨天", text: "订单 DD20260905-007 合同已双方签署", type: "合同" },
]

// ---------- 竞价回收 ----------
export interface BiddingItem {
  id: string
  title: string
  category: string
  region: string
  qty: string
  basePrice: string
  budget: string
  purchaseMethod: string
  contact: string
  allowPerson: boolean
  quotes: number
  topQuote: string
  publishTime: string
  signupStart: string
  signupEnd: string
  bidStart: string
  bidEnd: string
  deadline: string
  status: "进行中" | "待开标" | "已成交" | "已流标"
}

export const biddingList: BiddingItem[] = [
  { id: "JJ20260907-003", title: "重型废钢竞价采购公告", category: "重废", region: "江苏·苏州", qty: "500 吨", basePrice: "¥2,500/吨", budget: "¥1,250,000", purchaseMethod: "公开竞价", contact: "张工 138****2043", allowPerson: false, quotes: 6, topQuote: "¥2,650/吨", publishTime: "09-04 16:30", signupStart: "09-05 09:00", signupEnd: "09-07 17:00", bidStart: "09-08 09:00", bidEnd: "09-08 18:00", deadline: "09-08 18:00", status: "进行中" },
  { id: "JJ20260907-001", title: "冲花板料竞价采购公告", category: "统废", region: "上海·宝山", qty: "300 吨", basePrice: "¥2,380/吨", budget: "¥714,000", purchaseMethod: "公开竞价", contact: "李工 139****7781", allowPerson: false, quotes: 4, topQuote: "¥2,455/吨", publishTime: "09-04 14:10", signupStart: "09-05 09:00", signupEnd: "09-07 12:00", bidStart: "09-08 09:00", bidEnd: "09-08 12:00", deadline: "09-08 12:00", status: "进行中" },
  { id: "JJ20260906-008", title: "生铁边角料竞价公告", category: "生铁", region: "浙江·嘉兴", qty: "200 吨", basePrice: "¥2,900/吨", budget: "¥580,000", purchaseMethod: "公开竞价", contact: "赵工 137****5502", allowPerson: true, quotes: 3, topQuote: "—", publishTime: "09-03 10:20", signupStart: "09-04 09:00", signupEnd: "09-06 17:00", bidStart: "09-07 14:00", bidEnd: "09-07 20:00", deadline: "09-07 20:00", status: "待开标" },
  { id: "JJ20260905-004", title: "钢筋头竞价采购公告", category: "重废", region: "江苏·无锡", qty: "420 吨", basePrice: "¥2,450/吨", budget: "¥1,029,000", purchaseMethod: "公开竞价", contact: "陈工 136****1188", allowPerson: false, quotes: 9, topQuote: "¥2,620/吨", publishTime: "09-02 11:40", signupStart: "09-03 09:00", signupEnd: "09-05 12:00", bidStart: "09-06 09:00", bidEnd: "09-06 18:00", deadline: "09-06 18:00", status: "已成交" },
  { id: "JJ20260904-002", title: "马达铁竞价采购公告", category: "统废", region: "安徽·马鞍山", qty: "150 吨", basePrice: "¥2,300/吨", budget: "¥345,000", purchaseMethod: "公开竞价", contact: "王工 135****9920", allowPerson: true, quotes: 1, topQuote: "—", publishTime: "09-01 15:00", signupStart: "09-02 09:00", signupEnd: "09-04 12:00", bidStart: "09-05 09:00", bidEnd: "09-05 18:00", deadline: "09-05 18:00", status: "已流标" },
]

// 竞价发布表单选项
export const purchaseMethods = ["公开竞价"]
export const bidModes = ["多轮次报价(减价竞价)", "多轮次报价(增价竞价)", "一次性密封报价"]
export const payMethods = ["线上支付", "银行转账", "银行保函", "免收保证金"]
export const materialConditions = ["全新", "九成新", "八成新", "七成新及以下", "废旧"]
export const materialCategories = ["重废", "统废", "生铁", "废铁", "废钢筋", "其他"]

// 废钢三级分类树（新增物料弹窗使用）
export interface ScrapCategoryL1 {
  name: string
  children: { name: string; children: string[] }[]
}

export const scrapCategoryTree: ScrapCategoryL1[] = [
  {
    name: "废钢类",
    children: [
      { name: "重废类", children: ["优质重废", "重废"] },
      { name: "中轻废类", children: ["中重废", "中废", "剪切料", "轻废"] },
      { name: "颗粒/特殊成型料", children: ["钢筋切粒", "马蹄铁", "破碎废钢"] },
      { name: "打包料类", children: ["优质碳钢打包料", "三级打包料", "四级打包料"] },
      { name: "铁屑类", children: ["钢屑", "铁屑"] },
      { name: "大件毛料", children: ["优质重废毛料", "重废毛料", "中废毛料"] },
      { name: "型材/建筑毛料", children: ["架子管毛料"] },
      { name: "混杂毛料", children: ["剪切毛料", "统料毛料", "彩涂毛料"] },
      { name: "不锈钢系列", children: ["不锈钢304", "不锈钢316"] },
      { name: "其他合金钢", children: ["合金钢废钢"] },
    ],
  },
]

// ---------- 供应商视角：竞价管理 ----------
// 供应商是竞价的参与方：报名 → 缴报名费/保证金 → 报价竞价 → 中标 → 缴服务费/结算
export interface SupplierBidItem {
  id: string
  title: string
  buyer: string // 采购单位（钢厂）
  category: string
  region: string
  qty: string
  basePrice: string // 起拍价
  bidMode: string // 竞价方式
  signupEnd: string // 报名截止
  bidStart: string
  bidEnd: string
  signupFee: string // 报名费
  deposit: string // 保证金
  signupStatus: "未报名" | "报名待审" | "报名通过" | "报名驳回"
  feeStatus: "未缴" | "已缴" | "免缴"
  depositStatus: "未缴" | "已缴" | "已退还"
  myQuote: string // 我的最新报价
  myRank: string // 我的当前排名
  quotes: number // 参与家数
  result: "报名中" | "竞价中" | "已中标" | "未中标" | "待开标"
}

export const supplierBidList: SupplierBidItem[] = [
  { id: "JJ20260907-003", title: "重型废钢竞价采购公告", buyer: "华东特钢集团", category: "重废", region: "江苏·苏州", qty: "500 吨", basePrice: "¥2,500/吨", bidMode: "减价竞价", signupEnd: "09-07 17:00", bidStart: "09-08 09:00", bidEnd: "09-08 18:00", signupFee: "¥500", deposit: "¥50,000", signupStatus: "报名通过", feeStatus: "已缴", depositStatus: "已缴", myQuote: "¥2,480/吨", myRank: "第 1 名", quotes: 6, result: "竞价中" },
  { id: "JJ20260907-001", title: "冲花板料竞价采购公告", buyer: "宝武钢铁", category: "统废", region: "上海·宝山", qty: "300 吨", basePrice: "¥2,380/吨", bidMode: "减价竞价", signupEnd: "09-07 12:00", bidStart: "09-08 09:00", bidEnd: "09-08 12:00", signupFee: "¥500", deposit: "¥30,000", signupStatus: "报名通过", feeStatus: "已缴", depositStatus: "已缴", myQuote: "¥2,410/吨", myRank: "第 2 名", quotes: 4, result: "竞价中" },
  { id: "JJ20260907-005", title: "废旧设备增价竞卖公告", buyer: "兴澄特钢", category: "统废", region: "江苏·江阴", qty: "260 吨", basePrice: "¥2,600/吨", bidMode: "增价竞价", signupEnd: "09-07 15:00", bidStart: "09-08 09:00", bidEnd: "09-08 17:00", signupFee: "¥500", deposit: "¥26,000", signupStatus: "报名通过", feeStatus: "已缴", depositStatus: "已缴", myQuote: "¥2,650/吨", myRank: "第 3 名", quotes: 5, result: "竞价中" },
  { id: "JJ20260906-008", title: "生铁边角料竞价公告", buyer: "南钢股份", category: "生铁", region: "浙江·嘉兴", qty: "200 吨", basePrice: "¥2,900/吨", bidMode: "增价竞价", signupEnd: "09-06 17:00", bidStart: "09-07 14:00", bidEnd: "09-07 20:00", signupFee: "¥500", deposit: "¥20,000", signupStatus: "报名通过", feeStatus: "已缴", depositStatus: "已缴", myQuote: "—", myRank: "—", quotes: 3, result: "待开标" },
  { id: "JJ20260905-004", title: "钢筋头竞价采购公告", buyer: "沙钢集团", category: "重废", region: "江苏·无锡", qty: "420 吨", basePrice: "¥2,450/吨", bidMode: "减价竞价", signupEnd: "09-05 12:00", bidStart: "09-06 09:00", bidEnd: "09-06 18:00", signupFee: "¥500", deposit: "¥42,000", signupStatus: "报名通过", feeStatus: "已缴", depositStatus: "已退还", myQuote: "¥2,510/吨", myRank: "第 1 名", quotes: 9, result: "已中标" },
  { id: "JJ20260904-009", title: "汽车压块竞价回收公告", buyer: "中天钢铁", category: "统废", region: "江苏·常州", qty: "350 吨", basePrice: "¥3,050/吨", bidMode: "减价竞价", signupEnd: "09-04 12:00", bidStart: "09-05 09:00", bidEnd: "09-05 18:00", signupFee: "¥500", deposit: "¥35,000", signupStatus: "报名通过", feeStatus: "已缴", depositStatus: "已退还", myQuote: "¥3,120/吨", myRank: "第 4 名", quotes: 7, result: "未中标" },
  { id: "JJ20260908-006", title: "废旧钢结构竞价公告", buyer: "永钢集团", category: "重废", region: "江苏·张家港", qty: "600 吨", basePrice: "¥2,420/吨", bidMode: "减价竞价", signupEnd: "09-09 17:00", bidStart: "09-10 09:00", bidEnd: "09-10 18:00", signupFee: "¥500", deposit: "¥60,000", signupStatus: "未报名", feeStatus: "未缴", depositStatus: "未缴", myQuote: "—", myRank: "—", quotes: 2, result: "报名中" },
  { id: "JJ20260908-002", title: "马达铁竞价采购公告", buyer: "马钢股份", category: "统废", region: "安徽·马鞍山", qty: "180 吨", basePrice: "¥2,300/吨", bidMode: "增价竞价", signupEnd: "09-09 12:00", bidStart: "09-10 14:00", bidEnd: "09-10 20:00", signupFee: "¥500", deposit: "¥18,000", signupStatus: "报名待审", feeStatus: "已缴", depositStatus: "未缴", myQuote: "—", myRank: "—", quotes: 1, result: "报名中" },
]

export const supplierBidResultTone: Record<SupplierBidItem["result"], "primary" | "green" | "gray" | "amber"> = {
  报名中: "amber",
  竞价中: "primary",
  待开标: "gray",
  已中标: "green",
  未中标: "gray",
}

// ---------- 固定价回收 ----------
export interface FixedItem {
  id: string
  title: string
  category: string
  qty: string
  price: string
  taken: string
  validUntil: string
  status: "挂单中" | "部分成交" | "已完成" | "已下架"
}

export const fixedList: FixedItem[] = [
  { id: "GD20260907-011", title: "统一价收重废", category: "重废", qty: "1,000 吨", price: "¥2,560/吨", taken: "320 吨", validUntil: "09-15", status: "部分成交" },
  { id: "GD20260907-005", title: "一口价收统废", category: "统废", qty: "600 吨", price: "¥2,410/吨", taken: "0 吨", validUntil: "09-12", status: "挂单中" },
  { id: "GD20260906-009", title: "一口价收生铁", category: "生铁", qty: "400 吨", price: "¥2,950/吨", taken: "400 吨", validUntil: "09-10", status: "已完成" },
  { id: "GD20260905-002", title: "一口价收钢筋头", category: "重废", qty: "500 吨", price: "¥2,480/吨", taken: "500 吨", validUntil: "09-08", status: "已完成" },
]

// ---------- 协议回收 ----------
export interface AgreementItem {
  id: string
  supplier: string
  category: string
  monthlyQty: string
  price: string
  period: string
  status: "履约中" | "待签署" | "已到期"
}

export const agreementList: AgreementItem[] = [
  { id: "XY20260906-002", supplier: "城南再生资源回收站", category: "重废 / 统废", monthlyQty: "≥ 800 ���/月", price: "随行就市 -2%", period: "2026-01 ~ 2026-12", status: "履约中" },
  { id: "XY20260901-004", supplier: "盛通金属有限公司", category: "生铁", monthlyQty: "≥ 300 吨/月", price: "固定 ¥2,900/吨", period: "2026-03 ~ 2027-02", status: "履约中" },
  { id: "XY20260830-001", supplier: "环宇物资回收站", category: "统废", monthlyQty: "≥ 500 吨/月", price: "随行就市 -1.5%", period: "2026-09 ~ 2027-08", status: "待签署" },
  { id: "XY20251201-006", supplier: "利民废旧金属", category: "重废", monthlyQty: "≥ 400 吨/月", price: "固定 ¥2,500/吨", period: "2025-01 ~ 2025-12", status: "已到期" },
]

// ---------- 订单管理（含结算与合同） ----------
export interface OrderItem {
  id: string
  supplier: string
  channel: "竞价" | "固定价" | "协议"
  category: string
  qty: string
  amount: string
  settlement: "待结算" | "结算中" | "已结算"
  contract: "待签署" | "已签署" | "已归档"
  createdAt: string
}

export const orderList: OrderItem[] = [
  { id: "DD20260907-013", supplier: "华东再生资源", channel: "竞价", category: "重废", qty: "500 吨", amount: "¥1,325,000", settlement: "待结算", contract: "已签署", createdAt: "2026-09-07" },
  { id: "DD20260906-010", supplier: "城南再生资源回收站", channel: "协议", category: "统废", qty: "820 吨", amount: "¥1,972,400", settlement: "结算中", contract: "已签署", createdAt: "2026-09-06" },
  { id: "DD20260905-007", supplier: "盛通金属有限公司", channel: "固定价", category: "生铁", qty: "400 吨", amount: "¥1,180,000", settlement: "已结算", contract: "已归档", createdAt: "2026-09-05" },
  { id: "DD20260904-005", supplier: "张建国（自然人）", channel: "固定价", category: "统废", qty: "35 吨", amount: "¥84,350", settlement: "已结算", contract: "已归档", createdAt: "2026-09-04" },
  { id: "DD20260903-002", supplier: "环宇物资回收站", channel: "竞价", category: "重废", qty: "420 吨", amount: "¥1,100,400", settlement: "待结算", contract: "待签署", createdAt: "2026-09-03" },
]

// ---------- 供应商管理 ----------
export interface SupplierItem {
  id: string
  name: string
  type: "回收站" | "企业供应商" | "自然人"
  contact: string
  region: string
  supplyCategory: string
  totalQty: string
  status: "合作中" | "待审核" | "已停用"
  cooperation: "协议供应商" | "普通供应商"
}

export const supplierList: SupplierItem[] = [
  { id: "S001", name: "城南再生资源回收站", type: "回收站", contact: "李经理 138****2043", region: "江苏·苏州", supplyCategory: "重废/统废", totalQty: "9,860 吨", status: "合作中", cooperation: "协议供应商" },
  { id: "S002", name: "盛通金属有限公司", type: "企业供应商", contact: "王总 139****7781", region: "上海·宝山", supplyCategory: "生铁", totalQty: "5,240 吨", status: "合作中", cooperation: "协议供应商" },
  { id: "S003", name: "环宇物资回收站", type: "回收站", contact: "赵主管 137****5502", region: "浙江·嘉兴", supplyCategory: "统废", totalQty: "3,120 吨", status: "待审核", cooperation: "普通供应商" },
  { id: "S004", name: "张建国", type: "自然人", contact: "张建国 135****9920", region: "江苏·无锡", supplyCategory: "统废", totalQty: "620 吨", status: "合作中", cooperation: "普通供应商" },
  { id: "S005", name: "利民废旧金属", type: "企业供应商", contact: "陈经理 136****1188", region: "安徽·马鞍山", supplyCategory: "重废", totalQty: "2,050 吨", status: "已停用", cooperation: "普通供应商" },
]
