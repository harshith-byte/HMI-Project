// Modified ExplorePage.tsx component with proper data transformation

"use client";

import { useState } from "react";
import {
  Calendar,
  Download,
  Filter,
  LineChart as LineChartIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Map,
} from "lucide-react";
import { data } from "../../test-data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { DataChart } from "@/components/data-chart";
import { DataTable } from "@/components/data-table";
import { DataMap } from "@/components/data-map";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function ExplorePage() {
  const [selectedIndicator, setSelectedIndicator] = useState("Construction");

  const [viewMode, setViewMode] = useState<"chart" | "table" | "map">("chart");
  const [chartType, setChartType] = useState<"line" | "bar" | "pie">("line");

  const genderTableData = [
    {
      Indicator: "% of Exec Board Women",
      Value:
        data.data.summary.percent_of_executive_board_members_who_are_women
          .late_fall_2023,
      Trend:
        data.data.summary.percent_of_executive_board_members_who_are_women
          .trending,
    },
    {
      Indicator: "Companies w/ ≥1 Woman",
      Value:
        data.data.summary.companies_with_at_least_one_woman_on_executive_board
          .count,
      Trend:
        data.data.summary.companies_with_at_least_one_woman_on_executive_board
          .trending,
    },
    {
      Indicator: "Women CEOs",
      Value: data.data.summary.women_CEOs.count,
      Trend: data.data.summary.women_CEOs.trending,
    },
  ];
  const genderLineChartData = ["2021", "2022", "2023"].map((yearStr) => {
    const year = parseInt(
      yearStr
    ) as keyof typeof data.data.companies_by_number_of_women_on_executive_board;
    const values =
      data.data.companies_by_number_of_women_on_executive_board[year];

    return {
      quarter: yearStr,
      "0 Women": values[0],
      "1 Woman": values[1],
      "2 Women": values[2],
      "3+ Women": values[3] + values[4],
    };
  });

  const genderChartData = Object.entries(
    data.data.companies_by_number_of_women_on_executive_board["2023"]
  ).map(([numWomen, count]) => ({
    name: `${numWomen} Women`,
    value: count,
  }));

  // Transform data for different visualization types

  // For DataTable - Flat structure with all data points
  const tableData = data.dataset.flatMap((category) => {
    return category.values.map((item) => ({
      Category: category.label,
      Year: item.year,
      "Growth (%)": item.percent,
    }));
  });

  // For Line Chart - Years on X-axis, separate lines for each category
  const lineChartData = data.dataset[0].values.map((yearData) => {
    const result: any = {
      quarter: yearData.year, // Using quarter as dataKey required by the component
    };

    // Add values from each category for this year
    data.dataset.forEach((category) => {
      const matchingYearData = category.values.find(
        (v) => v.year === yearData.year
      );
      if (matchingYearData) {
        result[category.label] = matchingYearData.percent;
        // Also add a generic "value" field for the main line in single-line charts
        if (category.label === "Total Construction") {
          result.value = matchingYearData.percent;
        }
      }
    });

    return result;
  });

  // For Bar Chart - Categories on X-axis, values for a selected year (2025)
  const barChartData = data.dataset.map((category) => {
    const value2025 =
      category.values.find((v) => v.year === "2025")?.percent || 0;
    return {
      region: category.label, // Using region as dataKey required by the component
      value: value2025,
    };
  });

  // For Pie Chart - Shows distribution by category for latest year
  const pieChartData = data.dataset.map((category) => {
    const value2025 =
      category.values.find((v) => v.year === "2025")?.percent || 0;
    return {
      name: category.label,
      value: Math.abs(value2025), // Using absolute values for pie chart
    };
  });

  const getChartData = () => {
    if (selectedIndicator === "Gender Equality") {
      switch (chartType) {
        case "line":
          return genderLineChartData;
        case "bar":
        case "pie":
          return genderChartData;
        default:
          return genderChartData;
      }
    }
    // fallback for construction
    switch (chartType) {
      case "line":
        return lineChartData;
      case "bar":
        return barChartData;
      case "pie":
        return pieChartData;
      default:
        return lineChartData;
    }
  };

  const getTableData = () => {
    return selectedIndicator === "Gender Equality"
      ? genderTableData
      : tableData;
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold">Data Filters</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Region</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>
                      Germany (National)
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Berlin</SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Bavaria</SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      North Rhine-Westphalia
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Indicator Type</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={selectedIndicator === "Construction"}
                      onClick={() => setSelectedIndicator("Construction")}
                    >
                      Construction
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={selectedIndicator === "Gender Equality"}
                      onClick={() => setSelectedIndicator("Gender Equality")}
                    >
                      Gender Equality
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Labour</SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Macro Economy</SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Health</SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton>Subjective WellBeing</SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Finance</SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Emission Trading</SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Transport</SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Refugees & Migration</SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Date Range</SidebarGroupLabel>
              <SidebarGroupContent className="px-4">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    2020 - 2024
                  </p>
                  <Slider defaultValue={[75]} max={100} step={1} />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Custom
                  </Button>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>View Options</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="grid grid-cols-3 gap-2 px-4">
                  {/* <Button
                    variant={viewMode === "chart" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("chart")}
                  >
                    <LineChartIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "table" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                  >
                    <Filter className="h-4 w-4" />
                  </Button> */}
                  {/* <Button
                    variant={viewMode === "map" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("map")}
                  >
                    <Map className="h-4 w-4" />
                  </Button> */}
                </div>

                {viewMode === "chart" && (
                  <div className="grid grid-cols-3 gap-2 px-4 mt-2">
                    <Button
                      variant={chartType === "line" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setChartType("line")}
                    >
                      <LineChartIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={chartType === "bar" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setChartType("bar")}
                    >
                      <BarChartIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={chartType === "pie" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setChartType("pie")}
                    >
                      <PieChartIcon className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Explore Data
              </h1>
              <p className="text-muted-foreground">
                Interactive visualization of economic indicators
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Select defaultValue="quarterly">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Data Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="regional">Regional Breakdown</TabsTrigger>
              <TabsTrigger value="sector">Sector View</TabsTrigger>
              <TabsTrigger value="time">Time Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <CardTitle>
                {selectedIndicator === "Gender Equality"
                  ? "Gender Equality Summary (2023)"
                  : data.title}
              </CardTitle>
              <CardDescription>
                {selectedIndicator === "Gender Equality"
                  ? "Women on executive boards in major German companies"
                  : data.description}
              </CardDescription>
              <CardContent className="pt-2">
                {viewMode === "chart" && (
                  <DataChart type={chartType} data={getChartData()} />
                )}
                {viewMode === "table" && <DataTable data={getTableData()} />}
                {viewMode === "map" && <DataMap />}
              </CardContent>
            </TabsContent>
            {/* 
            <TabsContent value="regional">
              <Card>
                <CardHeader>
                  <CardTitle>Regional Construction Comparison</CardTitle>
                  <CardDescription>
                    Construction trends across different German regions
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  {viewMode === "chart" && (
                    <DataChart type={chartType} data={getChartData()} />
                  )}
                  {viewMode === "table" && <DataTable data={tableData} />}
                  {viewMode === "map" && <DataMap />}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sector">
              <Card>
                <CardHeader>
                  <CardTitle>{data.title}</CardTitle>
                  <CardDescription>{data.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  {viewMode === "chart" && (
                    <DataChart type={chartType} data={getChartData()} />
                  )}
                  {viewMode === "table" && <DataTable data={tableData} />}
                  {viewMode === "map" && <DataMap />}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="time">
              <Card>
                <CardHeader>
                  <CardTitle>Construction Trends Over Time</CardTitle>
                  <CardDescription>
                    Long-term construction trends with yearly comparisons
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  {viewMode === "chart" && (
                    <DataChart type={chartType} data={getChartData()} />
                  )}
                  {viewMode === "table" && <DataTable data={tableData} />}
                  {viewMode === "map" && <DataMap />}
                </CardContent>
              </Card>
            </TabsContent> */}
          </Tabs>
        </div>
      </div>
    </SidebarProvider>
  );
}
