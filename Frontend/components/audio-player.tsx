"use client"

import { useState, useEffect } from "react"
import { Play, Pause, X, Volume2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface AudioPlayerProps {
  isPlaying: boolean
  onPlayPause: () => void
  onClose: () => void
  title: string
}

export function AudioPlayer({ isPlaying, onPlayPause, onClose, title }: AudioPlayerProps) {
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(80)

  // Simulate progress when playing
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            onPlayPause()
            return 0
          }
          return prev + 0.5
        })
      }, 100)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, onPlayPause])

  const formatTime = (percent: number) => {
    // Assuming a 2-minute audio for demonstration
    const totalSeconds = 120 * (percent / 100)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.floor(totalSeconds % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex items-center justify-between bg-card rounded-lg p-4 shadow-md">
      <div className="flex items-center space-x-4">
        <Button size="icon" variant="ghost" onClick={onPlayPause} className="h-10 w-10 text-primary">
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>

        <div className="flex flex-col">
          <span className="font-medium">{title}</span>
          <div className="flex items-center text-xs text-muted-foreground">
            <span>{formatTime(progress)}</span>
            <span className="mx-1">/</span>
            <span>2:00</span>
          </div>
        </div>
      </div>

      <div className="flex-1 mx-8">
        <Slider
          value={[progress]}
          max={100}
          step={0.1}
          onValueChange={(value) => setProgress(value[0])}
          className="cursor-pointer"
        />
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 w-32">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider value={[volume]} max={100} step={1} onValueChange={(value) => setVolume(value[0])} />
        </div>

        <Button size="icon" variant="ghost" onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
