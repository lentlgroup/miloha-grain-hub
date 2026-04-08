import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProductsSection from "@/components/ProductsSection";
import TrustMetricsSection from "@/components/TrustMetricsSection";
import ProcessSection from "@/components/ProcessSection";
import DeliverySection from "@/components/DeliverySection";
import ServicesSection from "@/components/ServicesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const Index = () => (
  <div className="page-shell min-h-screen">
    <Navbar />
    <main className="relative z-10">
      <HeroSection />
      <AboutSection />
      <TrustMetricsSection />
      <ProductsSection />
      <ProcessSection />
      <DeliverySection />
      <ServicesSection />
      <TestimonialsSection />
      <FaqSection />
      <ContactSection />
    </main>
    <Footer />
    <FloatingWhatsApp />
  </div>
);

export default Index;
