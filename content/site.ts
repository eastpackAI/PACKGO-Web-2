/**
 * PACKGO 网站 2 · 内容层
 *
 * 说明：
 * - 本文件是网站 2 的**唯一内容来源**，页面组件只读这里，不在组件里散写文案。
 * - 内容口径来自已确认材料（Packy 产品基线、独立站页面方案、专项展厅信息架构、平台蓝图）。
 * - 未确认的东西一律标注「逐步开放 / 内测」，不写成已具备能力。
 */

/**
 * 部署子路径前缀。
 *
 * 发布到 GitHub Pages 的「项目站点」时，网站位于 `/<仓库名>/` 子路径下；
 * 而 `next/image` 在关闭图片优化（静态导出必须关闭）时不会自动补这个前缀，
 * 会让图片 404。这里显式拼接——本地开发与普通构建时该值为空，行为不变。
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const assetPath = (path: string) => `${BASE_PATH}${path}`;

export const brand = {
  name: "PACKGO",
  wordmark: "PACKGO",
  tagline: "包装定制，从一句话到一整套方案",
  industryNote: "龙港包装产业带 · 真实制造能力",
  /**
   * H1 采用「品类 + 能力」的搜索型写法（参考 Cubit 首页 H1 的信息密度），
   * 但内容全部换为 PACKGO 已确认的品类。
   */
  headline:
    "一站式包装定制 — 软包装袋、彩盒、标签贴纸、纸袋与无纺布袋",
  support:
    "把产品知识、材料工艺、工厂能力、真实价格与生产履约组织成一个入口：客户说清楚要什么，Packy 负责把它变成可报价、可打样、可生产的一整套方案。",
  primaryCta: "和 Packy 聊聊",
  secondaryCta: "看看我们能做什么",
  stageNote: "内测预览版 · 尚未对外发布",
  /**
   * 首屏主视觉。当前为**占位素材**（AI 生成的中性包装静物，无品牌、无文字），
   * 待真实拍摄素材到位后替换；替换只改这里，不动组件。
   */
  heroImage: {
    src: assetPath("/hero/packaging-set.jpg"),
    alt: "中性的包装静物：牛皮纸自立袋、白色纸盒、圆形标签与帆布袋",
    note: "占位素材（AI 生成）· 待真实拍摄替换",
  },
} as const;

export const nav = [
  { label: "解决方案", href: "#solutions" },
  { label: "产品品类", href: "#categories" },
  { label: "材料与工艺", href: "#manufacturing" },
  { label: "平台能力", href: "#platform" },
  { label: "关于 PACKGO", href: "#about" },
] as const;

/** 首页第一屏之后的四大产品形态（对应 Cubit 首页四个主形态卡片的位置）。 */
export const formats = [
  {
    id: "flexible",
    title: "软包装袋",
    latin: "Flexible Pouches",
    summary: "自立袋、平底袋、三边封、八边封；拉链、排气阀、易撕口按产品逐项确认。",
    points: ["咖啡与食品袋", "阻隔与保鲜", "拉链 / 排气阀"],
    accent: "#c89668",
    image: assetPath("/products/pouch.jpg"),
  },
  {
    id: "carton",
    title: "彩盒与纸盒",
    latin: "Folding Cartons",
    summary: "单张彩盒、邮寄盒、礼盒与展示盒，结构先定，再做表面工艺。",
    points: ["单张彩盒", "邮寄盒", "礼盒 / 展示盒"],
    accent: "#8f7a5f",
    image: assetPath("/products/carton.jpg"),
  },
  {
    id: "label",
    title: "标签与贴纸",
    latin: "Labels & Stickers",
    summary: "不干胶标签、防伪标签、封口贴；材质与胶性按贴附面确认。",
    points: ["产品标签", "防伪标签", "封口贴"],
    accent: "#7d8a72",
    image: assetPath("/products/labels.jpg"),
  },
  {
    id: "bags",
    title: "袋类与配套",
    latin: "Bags & Carriers",
    summary: "无纺布袋、纸袋、手提袋、麻布袋，与主包装一起成套交付。",
    points: ["无纺布袋", "纸袋 / 手提袋", "麻布袋"],
    accent: "#a98467",
    image: assetPath("/products/bags.jpg"),
  },
] as const;

/** 与主形态并列的三个能力条（对应 Cubit 的 AI Design / Dedicated Designer 位置）。 */
export const formatCapabilities = [
  {
    title: "AI 方案初稿",
    note: "先给方向与结构建议，不直接当作可生产文件；上机前必须过工程确认。",
  },
  {
    title: "专属包装经理",
    note: "Packy 跟着同一个项目走，不让你把需求从头讲第二遍。",
  },
  {
    title: "打样与工程确认",
    note: "规格、刀版、样品、付款逐项过门禁，才进入生产。",
  },
] as const;

/** Packy 专区（对应 Cubit 的 AI Packaging Consultant 版块）。 */
export const packy = {
  eyebrow: "Packy · 你的 AI 包装经理",
  title: "站在你这一边的包装经理，不是推销员",
  summary:
    "Packy 是 PACKGO 的客户侧包装经理：它先听懂你的产品，再带你去看最短的那条路——不是把问题一次全抛给你，也不是把你交给一份表单。",
  abilities: [
    {
      title: "一次只问 1～2 件事",
      body: "你说清楚多少，它就补多少。手上有旧资料就一次发过来，没有就一步一步确认。",
    },
    {
      title: "先判断这次想解决什么",
      body: "你说「以前做过」，它先分清这次是复刻、优化，还是想换更稳的供应链。",
    },
    {
      title: "找不到对应展厅也不打发你",
      body: "没有完全匹配的专项厅，它会带你进通用包装展厅，一边看一边把需求收窄。",
    },
  ],
  routes: [
    {
      label: "Discovery｜还不知道要做什么",
      note: "先看产品、工艺与真实产线，慢慢形成需求。",
    },
    {
      label: "Guided｜大概知道方向",
      note: "它判断品类，带你进对应专项展厅，边看边确认。",
    },
    {
      label: "Fast｜以前做过、资料齐全",
      note: "直接定位到最相关的展位，只补缺的那几项。",
    },
  ],
  sample: {
    customer: "我要做咖啡袋，以前做过。",
    packy: "明白。这次主要是保持原方案，还是想优化？我可以先带您进咖啡包装厅，按结构看一遍。",
  },
} as const;

/** 真实制造与材料（对应 Cubit 的 Eco-First Materials 版块位置）。 */
export const manufacturing = {
  eyebrow: "真实制造，不靠渲染图",
  title: "看得见的产线，查得到的依据",
  summary:
    "包装定制最容易出问题的地方在细节：材料对不对、结构能不能做、工艺有没有设备、交期排不排得进。这些我们都拿真实产线来回答。",
  pillars: [
    {
      title: "材料与结构",
      body: "按产品逐项确认阻隔、厚度、封口与开启方式，不用「高级材质」这类模糊说法。",
    },
    {
      title: "工艺与设备",
      body: "印刷、复合、烫金、压纹、模切等能力对应到真实设备，能做与不能做如实说明。",
    },
    {
      title: "真实产线影像",
      body: "用现场加工影像替代效果图，让你看到东西是怎么被做出来的。",
    },
    {
      title: "质检与证据",
      body: "关键节点留证：打样、确认、生产、检验，每一步有依据可回看。",
    },
  ],
  footnote: "龙港产业带 · 真实工厂协同 · 能力边界如实标注「已具备 / 逐步开放」",
  image: {
    src: assetPath("/factory/production-line.jpg"),
    alt: "包装工厂内的制袋与印刷生产线",
    note: "占位素材（AI 生成）· 待真实工厂影像替换",
  },
} as const;

/** 平台能力（对应 Cubit 的「All 7 Modules」版块）。 */
export const platform = {
  eyebrow: "PACKGO 平台",
  title: "一套事实，不用反复解释",
  summary:
    "客户、工厂、供应商看到的是各自的视图，读的却是同一套业务事实。信息不在聊天记录里散落，也不靠人记。",
  modules: [
    { no: "01", title: "需求澄清", body: "把口语化的需求落成结构化规格，而不是留在聊天里。" },
    { no: "02", title: "产品与制造模型", body: "产品、材料、工序、设备之间的对应关系可查。" },
    { no: "03", title: "两级报价", body: "先给初步报价，再由供应商确认成本形成精准报价。" },
    { no: "04", title: "工厂与供应商协同", body: "标准任务下达、价格与排期确认、异常上报。" },
    { no: "05", title: "订单与生产", body: "订单由已确认报价生成，生产按工序推进。" },
    { no: "06", title: "证据与质检", body: "关键节点留证，合格与否分开判定。" },
    { no: "07", title: "交付与复购", body: "发货、签收、结算与下一次复购都连着同一份历史。" },
  ],
  highlight: "七个环节共用同一份事实；人工确认永远保留在关键节点上。",
} as const;

/** 行业解决方案展厅（对应 Cubit 的 Solutions for Your Industry，依 C2L_011 的信息架构）。 */
export const industries = [
  {
    id: "coffee",
    title: "咖啡包装厅",
    latin: "Coffee Packaging",
    summary: "从咖啡豆袋到外盒、标签与手提配套，一整套在一个厅里组合。",
    includes: ["软包装袋 / 罐", "彩盒与邮寄盒", "标签与封口", "手提与配套"],
  },
  {
    id: "cosmetics",
    title: "化妆品包装厅",
    latin: "Cosmetics Packaging",
    summary: "重展示与手感：盒型、表面工艺与货架呈现一起定。",
    includes: ["彩盒 / 精品盒", "标签与瓶标", "烫金压纹", "展示与陈列"],
  },
  {
    id: "food",
    title: "食品零食包装厅",
    latin: "Snacks & Food Packaging",
    summary: "先解决保护与合规，再谈货架表现与成本。",
    includes: ["软包装袋", "阻隔与封口", "外盒", "标签与合规信息"],
  },
  {
    id: "daily-care",
    title: "日用品包装厅",
    latin: "Daily Care Packaging",
    summary: "补充装、瓶标与耐久性要求，按使用场景逐项确认。",
    includes: ["补充装袋", "瓶标与标签", "外盒", "封口与耐久"],
  },
] as const;

export const generalShowroom = {
  title: "通用包装展厅",
  latin: "General Packaging Showroom",
  summary:
    "没有对应专项厅、或需求跨行业、或暂时无法归类时，Packy 会带你进这里——它不是一个「其他」杂项页，而是可以自由组合包装能力的通用空间。",
  groups: ["直接包装", "外包装", "标签与贴纸", "袋类与手提", "展示与亚克力", "特殊定制"],
} as const;

/** 产品品类网格（对应 Cubit 的 Shop Custom Packaging）。 */
export const categories = [
  "软包装袋",
  "自立袋",
  "平底袋",
  "三边封 / 八边封袋",
  "彩盒",
  "精品盒",
  "邮寄盒",
  "展示盒",
  "不干胶标签",
  "防伪标签",
  "封口贴",
  "纸袋",
  "手提袋",
  "无纺布袋",
  "麻布袋",
  "内托与配件",
] as const;

export const about = {
  eyebrow: "关于 PACKGO",
  title: "把龙港的制造能力，变成客户能用的一整套方案",
  body: [
    "PACKGO 不是一个只放产品图的包装网站。它以龙港包装产业带的真实制造能力为基础，把产品知识、材料工艺、工厂能力、价格依据与生产履约组织起来，让客户用自己的语言就能把需求说清楚。",
    "我们不要求客户先学会我们的分类。客户只要说「我要做什么」，Packy 负责理解、判断、带路，并把每一步落到可报价、可打样、可生产的正式记录上。",
  ],
  facts: [
    { k: "起点", v: "龙港包装产业带" },
    { k: "首个验证产品", v: "自立咖啡袋" },
    { k: "当前阶段", v: "内测预览，未对外发布" },
  ],
} as const;

export const footer = {
  columns: [
    {
      title: "解决方案",
      links: ["咖啡包装厅", "化妆品包装厅", "食品零食包装厅", "日用品包装厅", "通用包装展厅"],
    },
    {
      title: "产品品类",
      links: ["软包装袋", "彩盒与纸盒", "标签与贴纸", "袋类与配套", "内托与配件"],
    },
    {
      title: "平台",
      links: ["需求澄清", "两级报价", "生产与质检", "证据与追溯", "复购与历史"],
    },
    {
      title: "公司",
      links: ["关于 PACKGO", "真实制造能力", "合作与供应", "联系我们"],
    },
  ],
  note: "本页面为内测预览，不对外发布；所有能力口径以已确认记录为准，未建成的部分标注「逐步开放」。",
  copyright: "PACKGO · 包装定制平台（内测）",
} as const;
