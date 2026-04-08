import HeroSection from "../components/HeroSection";
import ProductsSection from "../components/ProductsSection";
import FaqSection from "../components/FaqSection";
import TestimonialsSection from "../components/TestimonialsSection";
import TrustMetricsSection from "../components/TrustMetricsSection";
import DeliverySection from "../components/DeliverySection";
import ContactSection from "../components/ContactSection";

const LandingPage = () => {
    return (
        <div>
            <HeroSection />
            <ProductsSection />
            <TrustMetricsSection />
            <FaqSection />
            <TestimonialsSection />
            <DeliverySection />
            <ContactSection />
        </div>
    );
};

export default LandingPage;