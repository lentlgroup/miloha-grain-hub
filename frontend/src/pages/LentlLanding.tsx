import { LentlHeader } from "@/components/lentl/LentlHeader";
import { LentlHero } from "@/components/lentl/LentlHero";
import { LentlAbout } from "@/components/lentl/LentlAbout";
import { LentlArchitecture } from "@/components/lentl/LentlArchitecture";
import { LentlDivisions } from "@/components/lentl/LentlDivisions";
import { LentlPillars } from "@/components/lentl/LentlPillars";
import { LentlVisionMission } from "@/components/lentl/LentlVisionMission";
import { LentlCTABand } from "@/components/lentl/LentlCTABand";
import { LentlContact } from "@/components/lentl/LentlContact";
import { LentlFooter } from "@/components/lentl/LentlFooter";

/**
 * LeNTL Group corporate landing page.
 * This is the root page (/) of the website — the parent company gateway.
 * MILOHA Pure Grains operational page lives at /miloha.
 */
const LentlLanding = () => (
  <div className="min-h-screen font-montserrat antialiased">
    <LentlHeader />
    <main>
      <LentlHero />
      <LentlAbout />
      <LentlArchitecture />
      <LentlDivisions />
      <LentlPillars />
      <LentlVisionMission />
      <LentlCTABand />
      <LentlContact />
    </main>
    <LentlFooter />
  </div>
);

export default LentlLanding;
