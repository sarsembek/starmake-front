import { HeroSection } from "@/components/home-page/HeroSection/hero-section";
import { MainContent } from "@/components/main-content/main-content";

export default function Home() {
   return (
      <>
         <HeroSection />
         <MainContent />
         <div className="container mx-auto py-8">
            {/* Additional content can go here */}
         </div>
      </>
   );
}
