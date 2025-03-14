"use client";

import { createContext, useContext, useState } from "react";

type VideoContextType = {
   activeVideoId: number | null;
   setActiveVideoId: (id: number | null) => void;
};

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider = ({ children }: { children: React.ReactNode }) => {
   const [activeVideoId, setActiveVideoId] = useState<number | null>(null);

   return (
      <VideoContext.Provider value={{ activeVideoId, setActiveVideoId }}>
         {children}
      </VideoContext.Provider>
   );
};

export const useVideo = () => {
   const context = useContext(VideoContext);

   if (context === undefined) {
      throw new Error("useVideo must be used within a VideoProvider");
   }

   return context;
};
