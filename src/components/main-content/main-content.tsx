"use client";

import { SecretSection } from "@/components/home-page/SecretSection/secret-section";
import { AiSection } from "@/components/home-page/AiSection/ai-section";
import { BeforeAfterSection } from "@/components/home-page/BeforeAfterSection/before-after-section";
import { LibrarySection } from "@/components/home-page/LibrarySection/library-section";
import { CreateSection } from "@/components/home-page/CreateSection/create-section";
import { ConstructSection } from "@/components/home-page/ConstructSection/construct-section";
import { DatumBot } from "../home-page/DatumBot/datum-bot";

export function MainContent() {
   return (
      <main className="main">
         <SecretSection />
         <AiSection />
         <BeforeAfterSection />
         <LibrarySection />
         <CreateSection />
         <ConstructSection />
         <DatumBot />
      </main>
   );
}
