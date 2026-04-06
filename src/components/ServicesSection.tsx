import { Store, Truck, Package, ShieldCheck } from "lucide-react";

const services = [
  { icon: Store, title: "Retail Sales", desc: "Purchase grains directly from our Tegeta Azania outlet in any quantity — from 1kg bags to bulk orders." },
  { icon: Package, title: "Wholesale Supply", desc: "Competitive wholesale pricing for retailers, restaurants, hotels, and institutional buyers across Dar es Salaam." },
  { icon: Truck, title: "Delivery Service", desc: "Reliable delivery across Dar es Salaam and surrounding regions. Large orders shipped nationwide." },
  { icon: ShieldCheck, title: "Quality Assurance", desc: "Every batch undergoes quality testing for purity, moisture content, and freshness before it reaches you." },
];

const ServicesSection = () => (
  <section id="services" className="py-20 md:py-28 section-alt">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-sm font-semibold text-primary tracking-widest uppercase">Our Services</span>
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mt-3 mb-4">
          From Farm to Your Doorstep
        </h2>
        <p className="text-muted-foreground text-lg">
          We offer a full range of grain supply services to meet your needs, big or small.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((s) => (
          <div key={s.title} className="bg-card rounded-2xl p-7 card-elevated text-center">
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
              <s.icon size={28} className="text-accent" />
            </div>
            <h3 className="text-lg font-serif font-bold text-foreground mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
