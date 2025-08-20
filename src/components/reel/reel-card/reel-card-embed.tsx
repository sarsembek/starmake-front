declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process: () => void
      }
    }
  }
}

interface ReelCardEmbedProps {
  url: string
  shortcode: string
  view_count: number
  comment_count: number
  language: string
  country: string
  category_id: number
}

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { 
  Eye, 
  MessageCircle, 
  Globe, 
  Flag, 
  Tag 
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useEffect, useState } from "react"
import { useCategories } from "@/hooks/reels/useCategories"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function ReelCardEmbed({
  url,
  shortcode,
  view_count,
  comment_count,
  language,
  country,
  category_id
}: ReelCardEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const router = useRouter()
  
  // Handle click to navigate to reel details
  const handleReelClick = () => {
    if (shortcode) {
      router.push(`/library/reels/${shortcode}`)
    }
  }
  
  useEffect(() => {
    // подключаем embed.js один раз
    if (!document.querySelector("#instagram-embed-script")) {
      const script = document.createElement("script")
      script.id = "instagram-embed-script"
      script.async = true
      script.src = "//www.instagram.com/embed.js"
      script.onload = () => setIsLoaded(true)
      document.body.appendChild(script)
    } else {
      // если скрипт уже есть, обновляем вставки
      window.instgrm?.Embeds?.process()
      setIsLoaded(true)
    }
  }, [url])

  // Fetch all categories
  const { data: categories } = useCategories();
  // Find the matching category from our categories data
  const categoryData = categories?.find((cat) => cat.id === category_id);

  return (
    <Card className="overflow-hidden flex flex-col gap-1 pt-0" style={{ minWidth: '320px' }}>
      <CardContent className="p-0 relative">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <Image
              src="/placeholder.svg"
              alt="Loading..."
              width={100}
              height={100}
              className="opacity-50"
            />
          </div>
        )}
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={url}
          data-instgrm-version="14"
          style={{
            background: "#FFF",
            border: 0,
            margin: 0,
            padding: 0,
            maxWidth: "540px",
            width: "100%",
            minWidth: "320px",
            minHeight: "400px",
          }}
        >
        </blockquote>
        {/* Clickable overlay for navigation */}
        <div 
          className="absolute inset-0 cursor-pointer z-20 bg-transparent hover:bg-black/5 transition-colors"
          onClick={handleReelClick}
          title="Перейти к деталям Reels"
        />
      </CardContent>
      
      <div className="px-4 py-2">
        {/* Category, Language, Country Info */}
        <div className="flex items-center gap-2">
          {categoryData && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {categoryData.name_rus || categoryData.name}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Категория</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {language && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground uppercase">
                      {language}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Язык</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {country && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <Flag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {country}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Страна</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      <CardFooter className="px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {view_count}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {comment_count}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}