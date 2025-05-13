"use client"

import { useState } from "react"
import { Download, Play, Share2, Pause, Clock, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AudioPlayer } from "@/components/audio-player"

export default function AudioReportsPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentReport, setCurrentReport] = useState<string | null>(null)
  const [showTranscript, setShowTranscript] = useState(false)

  const handlePlay = (reportId: string) => {
    setCurrentReport(reportId)
    setIsPlaying(true)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Audio Reports</h1>
        <p className="text-muted-foreground">Listen to economic narratives and insights</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search-reports">Search</Label>
                <Input id="search-reports" placeholder="Search reports..." />
              </div>

              <div className="space-y-2">
                <Label>Region</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="germany">Germany</SelectItem>
                    <SelectItem value="berlin">Berlin</SelectItem>
                    <SelectItem value="bavaria">Bavaria</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Theme</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Themes</SelectItem>
                    <SelectItem value="inflation">Inflation</SelectItem>
                    <SelectItem value="employment">Employment</SelectItem>
                    <SelectItem value="gdp">GDP</SelectItem>
                    <SelectItem value="trade">Trade</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Time Period</Label>
                <Select defaultValue="2024">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Duration</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Durations</SelectItem>
                    <SelectItem value="short">Short ({"<"} 2 min)</SelectItem>
                    <SelectItem value="medium">Medium (2-5 min)</SelectItem>
                    <SelectItem value="long">Long ({">"} 5 min)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <Label htmlFor="show-transcript">Show Transcript</Label>
                <Switch id="show-transcript" checked={showTranscript} onCheckedChange={setShowTranscript} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Popular Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Inflation</Badge>
                <Badge variant="secondary">Employment</Badge>
                <Badge variant="secondary">GDP Growth</Badge>
                <Badge variant="secondary">Energy Prices</Badge>
                <Badge variant="secondary">Trade Balance</Badge>
                <Badge variant="secondary">Manufacturing</Badge>
                <Badge variant="secondary">Housing Market</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Tabs defaultValue="recent">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="series">Series</TabsTrigger>
              </TabsList>

              <Select defaultValue="newest">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="duration-asc">Duration (Shortest)</SelectItem>
                  <SelectItem value="duration-desc">Duration (Longest)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <TabsContent value="recent" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Germany's Economic Outlook – Q1 2024</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" /> 2 min
                        <Separator orientation="vertical" className="mx-2 h-3" />
                        <Calendar className="h-3 w-3 mr-1" /> March 15, 2024
                      </CardDescription>
                    </div>
                    <Badge>New</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Overview of Germany's economic performance in the first quarter with projections for the rest of the
                    year. Topics include inflation trends, employment statistics, and GDP growth forecasts.
                  </p>

                  {showTranscript && (
                    <div className="mt-4 p-3 bg-muted rounded-md text-sm">
                      <p className="font-medium mb-2">Transcript:</p>
                      <p>
                        Welcome to the DIW Economic Outlook for Q1 2024. Germany's economy has shown resilience in the
                        first quarter, with GDP growth reaching 0.9% compared to the previous quarter. Inflation has
                        stabilized at 4.2%, though this remains above the European Central Bank's target...
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={() => handlePlay("report-1")}>
                      {currentReport === "report-1" && isPlaying ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" /> Play
                        </>
                      )}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Share2 className="h-4 w-4 mr-2" /> Share
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Regional Economic Disparities in Germany</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" /> 3 min
                    <Separator orientation="vertical" className="mx-2 h-3" />
                    <Calendar className="h-3 w-3 mr-1" /> February 28, 2024
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Analysis of economic performance across different German regions and states. This report highlights
                    the growing disparities between urban centers and rural areas, with a focus on employment
                    opportunities and industrial development.
                  </p>

                  {showTranscript && (
                    <div className="mt-4 p-3 bg-muted rounded-md text-sm">
                      <p className="font-medium mb-2">Transcript:</p>
                      <p>
                        In this report, we examine the economic disparities across Germany's regions. While urban
                        centers like Munich, Frankfurt, and Berlin continue to thrive with unemployment rates below 5%,
                        rural areas in eastern Germany still face challenges with rates exceeding 8% in some regions...
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={() => handlePlay("report-2")}>
                      {currentReport === "report-2" && isPlaying ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" /> Play
                        </>
                      )}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Share2 className="h-4 w-4 mr-2" /> Share
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Impact of Energy Transition on German Economy</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" /> 4 min
                    <Separator orientation="vertical" className="mx-2 h-3" />
                    <Calendar className="h-3 w-3 mr-1" /> February 15, 2024
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Examination of how Germany's energy transition (Energiewende) is affecting various sectors of the
                    economy. This report covers the costs and benefits of renewable energy expansion, impact on
                    manufacturing, and future projections.
                  </p>

                  {showTranscript && (
                    <div className="mt-4 p-3 bg-muted rounded-md text-sm">
                      <p className="font-medium mb-2">Transcript:</p>
                      <p>
                        Germany's ambitious energy transition continues to reshape its economic landscape. While initial
                        investments in renewable infrastructure have created short-term costs, we're now seeing the
                        emergence of a robust green technology sector that has created over 300,000 jobs nationwide...
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={() => handlePlay("report-3")}>
                      {currentReport === "report-3" && isPlaying ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" /> Play
                        </>
                      )}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Share2 className="h-4 w-4 mr-2" /> Share
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="popular" className="mt-4">
              <div className="grid gap-4">
                {/* Popular reports would go here */}
                <Card>
                  <CardHeader>
                    <CardTitle>German Manufacturing Sector Analysis</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" /> 5 min
                      <Separator orientation="vertical" className="mx-2 h-3" />
                      <Calendar className="h-3 w-3 mr-1" /> January 10, 2024
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      In-depth analysis of Germany's manufacturing sector performance, challenges, and outlook. This
                      report has been played over 5,000 times.
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex space-x-2">
                      <Button size="sm">
                        <Play className="h-4 w-4 mr-2" /> Play
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" /> Download
                      </Button>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Share2 className="h-4 w-4 mr-2" /> Share
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="series" className="mt-4">
              <div className="grid gap-4">
                {/* Series reports would go here */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quarterly Economic Outlook Series</CardTitle>
                    <CardDescription>
                      Regular series covering Germany's economic performance each quarter
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm">Q1 2024 Outlook</p>
                        <Button size="sm" variant="ghost">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm">Q4 2023 Outlook</p>
                        <Button size="sm" variant="ghost">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm">Q3 2023 Outlook</p>
                        <Button size="sm" variant="ghost">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Audio Player (fixed at bottom when playing) */}
      {currentReport && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
          <AudioPlayer
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onClose={() => {
              setIsPlaying(false)
              setCurrentReport(null)
            }}
            title={
              currentReport === "report-1"
                ? "Germany's Economic Outlook – Q1 2024"
                : currentReport === "report-2"
                  ? "Regional Economic Disparities in Germany"
                  : "Impact of Energy Transition on German Economy"
            }
          />
        </div>
      )}
    </div>
  )
}
