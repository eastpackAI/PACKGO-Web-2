/**
 * PACKGO 网站 2 · 内容层
 *
 * 说明：
 * - 本文件是网站 2 的**唯一内容来源**，页面组件只读这里，不在组件里散写文案。
 * - 内容口径来自已确认材料（Packy 产品基线、独立站页面方案、专项展厅信息架构、平台蓝图）。
 * - 对外只讲"客户能得到什么"，不写内部机制、门禁与运行逻辑（内部说明另见仓库文档）。
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
  stageNote: "真实工厂直连 · 从设计到量产",
  /**
   * 首屏主视觉。当前为**占位素材**（AI 生成的中性包装静物，无品牌、无文字），
   * 待真实拍摄素材到位后替换；替换只改这里，不动组件。
   */
  heroImage: {
    src: assetPath("/hero/packaging-set.jpg"),
    alt: "中性的包装静物：牛皮纸自立袋、白色纸盒、圆形标签与帆布袋",
    note: "",
  },
} as const;

export const nav = [
  { label: "解决方案", href: "#solutions" },
  { label: "产品品类", href: "#categories" },
  { label: "材料与工艺", href: "#manufacturing" },
  { label: "为什么选我们", href: "#platform" },
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
    note: "先拿到方向与结构建议，快速看到可行方案，再进入正式打样。",
  },
  {
    title: "专属包装经理",
    note: "Packy 跟着同一个项目走，不让你把需求从头讲第二遍。",
  },
  {
    title: "打样与工程确认",
    note: "规格、刀版、样品逐项确认后才进入生产，每一步都有记录可回看。",
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
  footnote: "龙港产业带 · 真实工厂协同 · 做得到的和做不到的，都当面说清楚",
  image: {
    src: assetPath("/factory/production-line.jpg"),
    alt: "包装工厂内的制袋与印刷生产线",
    note: "",
  },
} as const;

/** 平台能力（对应 Cubit 的「All 7 Modules」版块）。 */
export const platform = {
  eyebrow: "为什么选择 PACKGO",
  title: "少来回、少猜测、少返工",
  summary:
    "包装定制最耗人的是来回确认与信息不对称。我们把该说清楚的提前说清楚，让你每一步都知道「现在到哪、接下来做什么」。",
  modules: [
    { no: "01", title: "需求不用讲第二遍", body: "一位专属包装经理从询价跟到量产，换人接手也不用你重新解释。" },
    { no: "02", title: "报价有依据", body: "先给初步报价看方向，工厂确认成本后再给精准报价，钱花在哪里说得清。" },
    { no: "03", title: "方案先看得到", body: "先给结构与方向建议，确认之后再进入打样，避免直接做错再返工。" },
    { no: "04", title: "交期有把握", body: "排期确认后才承诺交期；遇到异常提前告知，不让你临期才发现。" },
    { no: "05", title: "进度看得见", body: "打样、生产、质检到发货，关键节点随时可查，不用反复催问。" },
    { no: "06", title: "质量有记录", body: "关键环节留下实物与记录，后续出现疑问可以回溯到当时的状态。" },
    { no: "07", title: "复购更省事", body: "做过的规格与方案可以复用，第二次下单更快，也更不容易走样。" },
  ],
  highlight: "从第一次询价到下一次复购，都有人在同一个项目里跟到底。",
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
    "PACKGO 立足龙港包装产业带，直接对接真实工厂与产线。从软包装袋、彩盒、标签到纸袋与无纺布袋，你不需要在多个供应商之间来回对比、重复解释。",
    "你只要说清楚「要做什么、给谁用、什么时候要」，Packy 会带你确认规格、选材料、看工艺，并把方案推进到打样与量产——过程透明、价格有依据、进度可查。",
  ],
  facts: [
    { k: "起点", v: "龙港包装产业带" },
    { k: "首个验证产品", v: "自立咖啡袋" },
    { k: "服务范围", v: "软包装 / 彩盒 / 标签 / 袋类配套" },
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
      title: "服务优势",
      links: ["专属包装经理", "报价有依据", "打样与确认", "进度可查", "复购更省事"],
    },
    {
      title: "公司",
      links: ["关于 PACKGO", "真实制造能力", "合作与供应", "联系我们"],
    },
  ],
  note: "PACKGO · 龙港包装产业带真实制造能力 · 一站式包装定制（软包装袋 / 彩盒 / 标签 / 袋类配套）",
  copyright: "PACKGO · 包装定制",
} as const;
