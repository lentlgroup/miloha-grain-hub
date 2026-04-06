import { Target, Eye, Heart } from "lucide-react";

const values = [
  { icon: Target, title: "Our Mission", desc: "To provide the highest quality grains that nourish families across Tanzania and East Africa, while supporting local farmers and sustainable agriculture." },
  { icon: Eye, title: "Our Vision", desc: "To become Tanzania's most trusted grain brand, recognized nationally for purity, quality, and commitment to food safety." },
  { icon: Heart, title: "Core Values", desc: "Integrity, Quality, Sustainability, Community. We believe that pure grains build healthier lives and stronger communities." },
];

const AboutSection = () => (
  <section id="about" className="py-20 md:py-28 section-alt">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-sm font-semibold text-primary tracking-widest uppercase">About Us</span>
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mt-3 mb-4">
          Pure Grains, Pure Purpose
        </h2>
        <p className="text-muted-foreground text-lg">
          Based in Tegeta Azania, Dar es Salaam, MILOHA Pure Grains is a division of LIMBU ENTERPRISES LIMITED (LENTL GROUP) — dedicated to sourcing, processing, and distributing premium grains across Tanzania.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {values.map((v) => (
          <div key={v.title} className="bg-card rounded-2xl p-8 card-elevated text-center">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <v.icon size={28} className="text-primary" />
            </div>
            <h3 className="text-xl font-serif font-bold text-foreground mb-3">{v.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;
