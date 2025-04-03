"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ReelCard } from "@/components/reel/reel-card/reel-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSimilarReels } from "@/hooks/reels/useSimilarReels";

interface SimilarReelsSliderProps {
  reelId: number;
  limit?: number;
  className?: string;
}

export function SimilarReelsSlider({ 
  reelId,
  limit = 12,
  className
}: SimilarReelsSliderProps) {
  const { data, isLoading, error } = useSimilarReels({
    reelId,
    limit,
    page: 1,
    size: limit
  });
  
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  const checkScrollability = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    
    setCanScrollLeft(scrollPosition > 0);
    setCanScrollRight(
      container.scrollWidth > container.clientWidth + scrollPosition
    );
  }, [scrollPosition]);
  
  // Check scrollability when data or scroll position changes
  useEffect(() => {
    checkScrollability();
  }, [data, scrollPosition, checkScrollability]);
  
  // Listen for resize events
  useEffect(() => {
    window.addEventListener('resize', checkScrollability);
    return () => {
      window.removeEventListener('resize', checkScrollability);
    };
  }, [checkScrollability]);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = containerRef.current;
    if (!container) return;
    
    const cardWidth = 280; // Approximate width of each card + margin
    const scrollAmount = direction === 'left' ? -cardWidth * 2 : cardWidth * 2;
    
    const newScrollPosition = Math.max(
      0,
      Math.min(
        container.scrollWidth - container.clientWidth,
        scrollPosition + scrollAmount
      )
    );
    
    container.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth'
    });
    
    setScrollPosition(newScrollPosition);
  };

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <h2 className="text-xl font-semibold">Похожие ролики</h2>
        <div className="relative">
          <div className="flex gap-4 overflow-x-hidden py-4">
            {Array(4).fill(0).map((_, index) => (
              <div key={index} className="flex-shrink-0 w-64">
                <Skeleton className="aspect-[9/16] w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data || data.items.length === 0) {
    return null; // Don't show anything if there's an error or no similar reels
  }

  return (
    <div className={cn("space-y-4", className)}>
      <h2 className="text-xl font-semibold">Похожие ролики</h2>
      <div className="relative group">
        {canScrollLeft && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        
        <div 
          ref={containerRef}
          className="flex gap-4 overflow-x-auto py-4 scrollbar-hide snap-x"
          onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
        >
          {data.items.map((reel) => (
            <div 
              key={reel.id} 
              className="flex-shrink-0 snap-start" 
              style={{ width: '260px' }}
            >
              <ReelCard {...reel} size="sm" />
            </div>
          ))}
        </div>
        
        {canScrollRight && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleScroll('right')}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}