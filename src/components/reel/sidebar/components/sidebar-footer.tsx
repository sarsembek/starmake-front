import React from "react";
import { ChevronDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SidebarFooter = () => (
   <div className="p-4 border-t shrink-0">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Язык</span>
         </div>
         <Button variant="ghost" size="sm" className="h-8 gap-1">
            Русский
            <ChevronDown className="h-4 w-4" />
         </Button>
      </div>
   </div>
);
