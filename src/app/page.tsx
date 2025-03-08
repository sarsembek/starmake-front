export default function Home() {
   return (
      <div className="container mx-auto py-8">
         {/* Empty home page content */}
         <div className="min-h-[80vh] flex items-center justify-center">
            <h1 className="text-3xl font-bold">
               Welcome to{" "}
               <span
                  className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-purple-300 font-extrabold"
                  style={{ textShadow: "0px 0px 1px rgba(168, 85, 247, 0.4)" }}
               >
                  STAR
               </span>
               <span className="text-gray-700 dark:text-gray-400">MAKE</span>
            </h1>
         </div>
      </div>
   );
}
