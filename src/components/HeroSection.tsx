import heroImage from "@/assets/hero-grains.jpg";
import { ArrowRight, Wheat } from "lucide-react";

const HeroSection = () => (
  <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
    <img src={heroImage} alt="Premium grains by MILOHA" width={1920} height={1080} className="absolute inset-0 w-full h-full object-cover" />
    <div className="absolute inset-0 hero-overlay opacity-80" />

    <div className="relative z-10 container mx-auto px-4 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-6">
        <Wheat size={16} className="text-primary-foreground/80" />
        <span className="text-sm font-medium text-primary-foreground/80 tracking-wide">MILOHA PURE GRAINS</span>
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-primary-foreground leading-tight mb-4 animate-fade-in-up">
        Nafaka Safi,<br />Maisha Salama
      </h1>

      <p className="max-w-2xl mx-auto text-lg md:text-xl text-primary-foreground/70 mb-8" style={{ animationDelay: "0.2s" }}>
        Delivering premium quality grains from Tanzania's finest farms to your table. A brand of LIMBU ENTERPRISES LIMITED (LENTL GROUP).
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4" style={{ animationDelay: "0.4s" }}>
        <a href="#products" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity">
          Explore Products <ArrowRight size={18} />
        </a>
        <a href="#contact" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg border-2 border-primary-foreground/30 text-primary-foreground font-semibold text-base hover:bg-primary-foreground/10 transition-colors">
          Contact Us
        </a>
      </div>
    </div>
  </section>
);

export default HeroSection;
