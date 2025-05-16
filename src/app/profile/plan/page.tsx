import { PlanCard } from "@/components/profile/plan/PlanCard";

export default function PlansPage() {
   return (
      <div className="px-4 sm:px-8 md:px-16 lg:px-24 py-10 lg:py-20 bg-[#0B1B2A]">
         <div className="flex flex-col md:flex-row md:justify-between text-white gap-4 mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold">Тарифы</h1>
            <p className="max-w-xs">
               Стань звездой соцсетей с помощью AI-генерации трендовых видео
            </p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Standard Plans - One column on mobile, three columns on desktop */}
            <PlanCard name="Только посмотреть" price={11} messageCount={100} />
            <PlanCard name="Стандартный" price={16} messageCount={1000} />
            <PlanCard name="Безлимитный" price={29} messageCount="безлимит" />

            {/* Premium Plan - Spans all three columns on desktop */}
            <PlanCard
               name="Эксклюзив"
               price={93}
               messageCount={"безлимит"}
               variant="premium"
               className="col-span-1 md:col-span-3 mt-5"
            />
         </div>
      </div>
   );
}
