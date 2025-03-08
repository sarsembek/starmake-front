"use client";

import { SecretSection } from "@/components/HomePage/SecretSection/secret-section";
import { AiSection } from "@/components/HomePage/AiSection/ai-section";
import { BeforeAfterSection } from "@/components/HomePage/BeforeAfterSection/before-after-section";
import { LibrarySection } from "@/components/HomePage/LibrarySection/library-section";
import { CreateSection } from "@/components/HomePage/CreateSection/create-section";
import { ConstructSection } from "@/components/HomePage/ConstructSection/construct-section";
import { DatumBot } from "../HomePage/DatumBot/datum-bot";

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
