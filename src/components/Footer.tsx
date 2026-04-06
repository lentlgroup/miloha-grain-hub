const Footer = () => (
  <footer className="bg-secondary text-secondary-foreground py-12">
    <div className="container mx-auto px-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        <div>
          <span className="text-2xl font-serif font-bold">MILOHA</span>
          <p className="text-secondary-foreground/60 text-sm mt-2 leading-relaxed">
            Pure Grains, Pure Purpose. A brand of LIMBU ENTERPRISES LIMITED (LENTL GROUP).
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-secondary-foreground/60">
            <li><a href="#home" className="hover:text-secondary-foreground transition-colors">Home</a></li>
            <li><a href="#about" className="hover:text-secondary-foreground transition-colors">About</a></li>
            <li><a href="#products" className="hover:text-secondary-foreground transition-colors">Products</a></li>
            <li><a href="#services" className="hover:text-secondary-foreground transition-colors">Services</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Products</h4>
          <ul className="space-y-2 text-sm text-secondary-foreground/60">
            <li>Premium Rice</li>
            <li>Quality Maize</li>
            <li>Mixed Beans</li>
            <li>Packaged Grains</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-secondary-foreground/60">
            <li>Tegeta Azania, Dar es Salaam</li>
            <li>+255 XXX XXX XXX</li>
            <li>info@milohapuregrains.co.tz</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-secondary-foreground/10 pt-6 text-center text-sm text-secondary-foreground/40">
        © {new Date().getFullYear()} MILOHA Pure Grains — LIMBU ENTERPRISES LIMITED. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
