import { AboutSection } from "@/components/site/AboutSection";
import { CategoryGrid } from "@/components/site/CategoryGrid";
import { Footer } from "@/components/site/Footer";
import { FormatGrid } from "@/components/site/FormatGrid";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { IndustrySolutions } from "@/components/site/IndustrySolutions";
import { ManufacturingSection } from "@/components/site/ManufacturingSection";
import { PackySection } from "@/components/site/PackySection";
import { WorkbenchSection } from "@/components/site/WorkbenchSection";
import { PackyDrawer } from "@/components/site/PackyDrawer";
import { PlatformSection } from "@/components/site/PlatformSection";

/**
 * 网站 2 首页。
 *
 * 版块顺序（参考 Cubit Packaging 首页的信息组织）：
 *   1. 首屏：定位 + 双 CTA + 能力条
 *   2. 主要包装形态（4） + 三项能力条
 *   3. Packy 专区（对应竞品的 AI 顾问版块）
 *   4. 真实制造与材料
 *   5. 平台能力（七个环节）
 *   6. 行业解决方案展厅 + 通用包装展厅
 *   7. 产品品类网格
 *   8. 关于 PACKGO
 *   9. 页脚
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FormatGrid />
        <PackySection />
        <WorkbenchSection />
        <PackyDrawer />
        <ManufacturingSection />
        <PlatformSection />
        <IndustrySolutions />
        <CategoryGrid />
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
