import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import Hero from "@/components/sections/Hero/Hero";
import Services from "@/components/sections/Services/Services";
import SectionTransition from "@/components/sections/SectionTransition/SectionTransition";
import DigitalFlow from "@/components/sections/DigitalFlows/DigitalFlow";
import StatsSection from "@/components/sections/StatsSection/StatsSection";
import FloatingActions from "@/components/ui/FloatingActions/FloatingActions";
import ServicesSection from "@/components/sections/ServicesSection/ServicesSection";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <SectionTransition first={<Hero />} second={<Services />} />
        {/* <ServicesShowcase /> */}
        <ServicesSection/>
        <DigitalFlow />
        <StatsSection />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
