import riceImg from "@/assets/product-rice.jpg";
import maizeImg from "@/assets/product-maize.jpg";
import beansImg from "@/assets/product-beans.jpg";
import packagedImg from "@/assets/product-packaged.jpg";

const products = [
  { img: riceImg, name: "Premium Rice", desc: "Grade A polished and unpolished rice varieties sourced from Tanzania's finest paddy fields.", tag: "Best Seller" },
  { img: maizeImg, name: "Quality Maize", desc: "Clean, dried and sorted maize kernels ideal for ugali, flour milling, and animal feed.", tag: "Popular" },
  { img: beansImg, name: "Mixed Beans", desc: "Nutritious bean varieties — kidney, soy, black, and mixed — rich in protein and fiber.", tag: "Nutritious" },
  { img: packagedImg, name: "Packaged Products", desc: "Branded MILOHA packaged grains ready for retail shelves, available in 1kg, 5kg, and 25kg bags.", tag: "New" },
];

const ProductsSection = () => (
  <section id="products" className="py-20 md:py-28">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-sm font-semibold text-primary tracking-widest uppercase">Our Products</span>
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mt-3 mb-4">
          Quality You Can Trust
        </h2>
        <p className="text-muted-foreground text-lg">
          Every grain is carefully selected, cleaned, and packaged to preserve freshness and nutritional value.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div key={p.name} className="bg-card rounded-2xl overflow-hidden card-elevated group">
            <div className="relative aspect-square overflow-hidden">
              <img src={p.img} alt={p.name} loading="lazy" width={640} height={640} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                {p.tag}
              </span>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-serif font-bold text-foreground mb-1">{p.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ProductsSection;
