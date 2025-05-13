"use client";
import { ArrowDown, ArrowUp, TrendingUp } from "lucide-react";
import Link from "next/link";
import { data } from "../test-data";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendCard } from "@/components/trend-card";
import { QuickInsight } from "@/components/quick-insight";
import { SearchBar } from "@/components/ui/search-bar";

export default function Home() {
  const [selectedIndicator, setSelectedIndicator] = useState("all");
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Hero Section */}
      <section className="mb-8 space-y-4">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Latest trends in German Economy
          </h1>
          <p className="text-muted-foreground">
            Explore key economic indicators and trends across Germany and its
            regions.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Select defaultValue="germany">
            <SelectTrigger>
              <SelectValue placeholder="Select Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="germany">Germany</SelectItem>
              <SelectItem value="berlin">Berlin</SelectItem>
              <SelectItem value="bavaria">Bavaria</SelectItem>
              <SelectItem value="north-rhine-westphalia">
                North Rhine-Westphalia
              </SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="2023-q4">
            <SelectTrigger>
              <SelectValue placeholder="Select Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023-q4">Q4 2023</SelectItem>
              <SelectItem value="2023-q3">Q3 2023</SelectItem>
              <SelectItem value="2023-q2">Q2 2023</SelectItem>
              <SelectItem value="2023-q1">Q1 2023</SelectItem>
              <SelectItem value="2023">Year 2023</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedIndicator}
            onValueChange={setSelectedIndicator}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Indicator" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Indicators</SelectItem>
              <SelectItem value="gender">Gender Equality</SelectItem>
              <SelectItem value="labour">Labour</SelectItem>
              <SelectItem value="macro">MacroEconomy</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="wellBeing">Subjective WellBeing</SelectItem>
              <SelectItem value="emission">Emission Trading</SelectItem>
              <SelectItem value="transport">Transport</SelectItem>
              <SelectItem value="migration">Refugees And Migration</SelectItem>
            </SelectContent>
          </Select>

          <div>
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Featured Cards */}
      <section className="mb-8 grid gap-4 md:grid-cols-3">
        {selectedIndicator === "gender" ? (
          <>
            <TrendCard
              title="Women on Exec Boards"
              value={`${data.data.summary.percent_of_executive_board_members_who_are_women.late_fall_2023}%`}
              trend={
                data.data.summary
                  .percent_of_executive_board_members_who_are_women.trending as
                  | "up"
                  | "down"
                  | "neutral"
              }
              icon={
                data.data.summary
                  .percent_of_executive_board_members_who_are_women.trending ===
                "up" ? (
                  <ArrowUp className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-red-500" />
                )
              }
              description="Late Fall 2023 data"
            />
            <TrendCard
              title="Companies w/ ≥1 Woman"
              value={data.data.summary.companies_with_at_least_one_woman_on_executive_board.count.toString()}
              trend={
                data.data.summary
                  .companies_with_at_least_one_woman_on_executive_board
                  .trending as "up" | "down" | "neutral"
              }
              icon={
                data.data.summary
                  .companies_with_at_least_one_woman_on_executive_board
                  .trending === "up" ? (
                  <ArrowUp className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-red-500" />
                )
              }
              description="Companies with at least one woman on the board"
            />
            <TrendCard
              title="Women CEOs"
              value={data.data.summary.women_CEOs.count.toString()}
              trend={
                data.data.summary.women_CEOs.trending as
                  | "up"
                  | "down"
                  | "neutral"
              }
              icon={
                data.data.summary.women_CEOs.trending === "up" ? (
                  <ArrowUp className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-red-500" />
                )
              }
              description="Number of female CEOs"
            />
          </>
        ) : (
          <>
            {/* Default fallback cards (like inflation/GDP/unemployment) */}
            <TrendCard
              title="Inflation Rate"
              value="4.2%"
              trend="up"
              icon={<ArrowUp className="h-4 w-4 text-red-500" />}
              description="Q4 2023 rise"
            />
            <TrendCard
              title="GDP Growth"
              value="0.9%"
              trend="up"
              icon={<TrendingUp className="h-4 w-4 text-green-500" />}
              description="Steady growth trend"
            />
            <TrendCard
              title="Women Exec %"
              value="18%"
              trend="up"
              icon={<ArrowUp className="h-4 w-4 text-green-500" />}
              description="Gender equality improving"
            />
            <TrendCard
              title="Unemployment Rate"
              value="6.1%"
              trend="down"
              icon={<ArrowDown className="h-4 w-4 text-green-500" />}
              description="Decreased slightly"
            />
          </>
        )}
      </section>

      {/* Quick Insights */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-bold tracking-tight">
          Quick Insights
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <QuickInsight
            title="Manufacturing"
            value="+2.1%"
            description="Production increased in Q4"
          />
          <QuickInsight
            title="Consumer Spending"
            value="+0.8%"
            description="Modest growth in retail sector"
          />
          <QuickInsight
            title="Energy Prices"
            value="-3.2%"
            description="Decreasing trend since summer"
          />
          <QuickInsight
            title="Export Volume"
            value="+1.7%"
            description="Strong performance in automotive"
          />
        </div>
      </section>

      {/* Recent Reports */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Recent Reports</h2>
          <Button variant="outline" asChild>
            <Link href="/audio-reports">View All Reports</Link>
          </Button>
        </div>

        <Tabs defaultValue="audio" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="audio">Audio Reports</TabsTrigger>
            <TabsTrigger value="data">Data Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="audio" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Germany's Economic Outlook – Q1 2024</CardTitle>
                <CardDescription>
                  2 min • Published March 15, 2024
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Overview of Germany's economic performance in the first
                  quarter with projections for the rest of the year.
                </p>
                <div className="flex space-x-2">
                  <Button size="sm">
                    <span className="mr-1">▶</span> Play
                  </Button>
                  <Button size="sm" variant="outline">
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Regional Economic Disparities in Germany</CardTitle>
                <CardDescription>
                  3 min • Published February 28, 2024
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Analysis of economic performance across different German
                  regions and states.
                </p>
                <div className="flex space-x-2">
                  <Button size="sm">
                    <span className="mr-1">▶</span> Play
                  </Button>
                  <Button size="sm" variant="outline">
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Quarterly Economic Indicators</CardTitle>
                <CardDescription>Updated March 10, 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Comprehensive dataset of key economic indicators for Q1 2024.
                </p>
                <Button size="sm" variant="outline">
                  Download CSV
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Labor Market Analysis</CardTitle>
                <CardDescription>Updated February 20, 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Detailed breakdown of employment statistics across sectors.
                </p>
                <Button size="sm" variant="outline">
                  Download CSV
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
