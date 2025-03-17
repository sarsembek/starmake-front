"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft } from "lucide-react"

interface ProgressFooterProps {
  progressValue: number
  onPrevious: () => void
  onNext: () => void
  isNextDisabled?: boolean
}

export function ProgressFooter({ progressValue, onPrevious, onNext, isNextDisabled = false }: ProgressFooterProps) {
  return (
    <div className="mt-8 mb-4">
      <div className="max-w-6xl mx-auto">
        <Progress value={progressValue} className="h-2 mb-4" />
        <div className="flex justify-between">
          <Button variant="outline" size="icon" onClick={onPrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button onClick={onNext} disabled={isNextDisabled} className="px-8">
            Далее
          </Button>
        </div>
      </div>
    </div>
  )
}

