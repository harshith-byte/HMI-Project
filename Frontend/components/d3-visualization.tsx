"use client";
import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  PieChartIcon,
  LineChart,
  TrendingUp,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type VisualizationProps = {
  indicator: string;
};

export function D3Visualization({ indicator }: VisualizationProps) {
  const barChartRef = useRef<SVGSVGElement | null>(null);
  const pieChartRef = useRef<SVGSVGElement | null>(null);
  const lineChartRef = useRef<SVGSVGElement | null>(null);
  const [activeTab, setActiveTab] = useState("bar");

  // Generate appropriate data based on the indicator
  const getData = () => {
    switch (indicator) {
      case "gender equality":
        return {
          bar: [
            { name: "Pay Gap", value: 18 },
            { name: "Leadership Positions", value: 32 },
            { name: "Workforce Participation", value: 46 },
            { name: "Education Attainment", value: 78 },
          ],
          pie: [
            { name: "Male CEOs", value: 82 },
            { name: "Female CEOs", value: 18 },
          ],
          line: [
            { year: 2018, value: 21 },
            { year: 2019, value: 20 },
            { year: 2020, value: 19 },
            { year: 2021, value: 18.5 },
            { year: 2022, value: 18 },
          ],
        };
      case "labour":
        return {
          bar: [
            { name: "Unemployment", value: 6.1 },
            { name: "Job Growth", value: 2.3 },
            { name: "Vacancies", value: 3.8 },
            { name: "Part-time", value: 28.5 },
          ],
          pie: [
            { name: "Full-time", value: 71.5 },
            { name: "Part-time", value: 28.5 },
          ],
          line: [
            { year: 2018, value: 7.2 },
            { year: 2019, value: 6.8 },
            { year: 2020, value: 8.5 },
            { year: 2021, value: 7.3 },
            { year: 2022, value: 6.1 },
          ],
        };
      case "marcoeconomy":
        return {
          bar: [
            { name: "GDP Growth", value: 0.9 },
            { name: "Inflation", value: 4.2 },
            { name: "Interest Rate", value: 3.5 },
            { name: "Trade Balance", value: 2.7 },
          ],
          pie: [
            { name: "Services", value: 68 },
            { name: "Manufacturing", value: 24 },
            { name: "Agriculture", value: 8 },
          ],
          line: [
            { year: 2018, value: 1.1 },
            { year: 2019, value: 0.6 },
            { year: 2020, value: -4.6 },
            { year: 2021, value: 2.7 },
            { year: 2022, value: 0.9 },
          ],
        };
      case "health":
        return {
          bar: [
            { name: "Life Expectancy", value: 81.2 },
            { name: "Healthcare Spending (%GDP)", value: 11.7 },
            { name: "Hospital Beds (per 1000)", value: 8 },
            { name: "Physicians (per 1000)", value: 4.3 },
          ],
          pie: [
            { name: "Public Insurance", value: 88 },
            { name: "Private Insurance", value: 12 },
          ],
          line: [
            { year: 2018, value: 80.8 },
            { year: 2019, value: 80.9 },
            { year: 2020, value: 80.2 },
            { year: 2021, value: 80.8 },
            { year: 2022, value: 81.2 },
          ],
        };
      case "finance":
        return {
          bar: [
            { name: "Stock Market Growth", value: 5.8 },
            { name: "Bond Yields", value: 2.4 },
            { name: "Banking Assets Growth", value: 7.2 },
            { name: "Household Debt (%Income)", value: 93.9 },
          ],
          pie: [
            { name: "Equity", value: 35 },
            { name: "Bonds", value: 45 },
            { name: "Cash", value: 15 },
            { name: "Other", value: 5 },
          ],
          line: [
            { year: 2018, value: 3.2 },
            { year: 2019, value: 4.5 },
            { year: 2020, value: -2.1 },
            { year: 2021, value: 7.8 },
            { year: 2022, value: 5.8 },
          ],
        };
      case "subjective wellbeing":
        return {
          bar: [
            { name: "Life Satisfaction", value: 7.2 },
            { name: "Work-Life Balance", value: 6.8 },
            { name: "Social Support", value: 8.1 },
            { name: "Sense of Community", value: 6.5 },
          ],
          pie: [
            { name: "Very Satisfied", value: 28 },
            { name: "Satisfied", value: 42 },
            { name: "Neutral", value: 18 },
            { name: "Dissatisfied", value: 12 },
          ],
          line: [
            { year: 2018, value: 6.9 },
            { year: 2019, value: 7.0 },
            { year: 2020, value: 6.7 },
            { year: 2021, value: 6.9 },
            { year: 2022, value: 7.2 },
          ],
        };
      case "emission trading":
        return {
          bar: [
            { name: "Carbon Price (€/ton)", value: 85.2 },
            { name: "Emissions Reduction (%)", value: 12.4 },
            { name: "Trading Volume (Mt)", value: 1542 },
            { name: "Renewable Share (%)", value: 46.8 },
          ],
          pie: [
            { name: "Energy", value: 52 },
            { name: "Industry", value: 28 },
            { name: "Aviation", value: 12 },
            { name: "Other", value: 8 },
          ],
          line: [
            { year: 2018, value: 15.8 },
            { year: 2019, value: 24.7 },
            { year: 2020, value: 33.5 },
            { year: 2021, value: 54.3 },
            { year: 2022, value: 85.2 },
          ],
        };
      case "transport":
        return {
          bar: [
            { name: "Public Transit Usage (%)", value: 32.5 },
            { name: "EV Market Share (%)", value: 17.8 },
            { name: "Rail Freight (%)", value: 19.2 },
            { name: "Road Infrastructure Score", value: 8.4 },
          ],
          pie: [
            { name: "Cars", value: 58 },
            { name: "Public Transit", value: 32 },
            { name: "Cycling", value: 7 },
            { name: "Other", value: 3 },
          ],
          line: [
            { year: 2018, value: 5.2 },
            { year: 2019, value: 7.8 },
            { year: 2020, value: 10.5 },
            { year: 2021, value: 14.2 },
            { year: 2022, value: 17.8 },
          ],
        };
      case "refugees & migration":
        return {
          bar: [
            { name: "Asylum Applications (thousands)", value: 217.8 },
            { name: "Integration Index", value: 7.2 },
            { name: "Employment Rate (%)", value: 68.5 },
            { name: "Foreign-born Population (%)", value: 16.2 },
          ],
          pie: [
            { name: "EU Countries", value: 42 },
            { name: "Asia", value: 30 },
            { name: "Africa", value: 18 },
            { name: "Other", value: 10 },
          ],
          line: [
            { year: 2018, value: 184.2 },
            { year: 2019, value: 165.9 },
            { year: 2020, value: 122.4 },
            { year: 2021, value: 148.2 },
            { year: 2022, value: 217.8 },
          ],
        };
      default:
        return {
          bar: [
            { name: "Metric 1", value: 45 },
            { name: "Metric 2", value: 65 },
            { name: "Metric 3", value: 35 },
            { name: "Metric 4", value: 55 },
          ],
          pie: [
            { name: "Category A", value: 45 },
            { name: "Category B", value: 55 },
          ],
          line: [
            { year: 2018, value: 40 },
            { year: 2019, value: 45 },
            { year: 2020, value: 35 },
            { year: 2021, value: 50 },
            { year: 2022, value: 55 },
          ],
        };
    }
  };

  // Get chart title based on indicator
  const getChartTitle = () => {
    switch (indicator) {
      case "gender equality":
        return activeTab === "bar"
          ? "Gender Equality Metrics"
          : activeTab === "pie"
          ? "CEO Gender Distribution"
          : "Pay Gap Trend (2018-2022)";
      case "labour":
        return activeTab === "bar"
          ? "Labour Market Indicators"
          : activeTab === "pie"
          ? "Employment Type Distribution"
          : "Unemployment Rate Trend (2018-2022)";
      case "marcoeconomy":
        return activeTab === "bar"
          ? "Macroeconomic Indicators"
          : activeTab === "pie"
          ? "Economic Sector Distribution"
          : "GDP Growth Trend (2018-2022)";
      case "health":
        return activeTab === "bar"
          ? "Health System Metrics"
          : activeTab === "pie"
          ? "Health Insurance Distribution"
          : "Life Expectancy Trend (2018-2022)";
      case "finance":
        return activeTab === "bar"
          ? "Financial Indicators"
          : activeTab === "pie"
          ? "Investment Portfolio Distribution"
          : "Stock Market Growth Trend (2018-2022)";
      case "subjective wellbeing":
        return activeTab === "bar"
          ? "Wellbeing Indicators"
          : activeTab === "pie"
          ? "Life Satisfaction Distribution"
          : "Life Satisfaction Trend (2018-2022)";
      case "emission trading":
        return activeTab === "bar"
          ? "Emission Trading Metrics"
          : activeTab === "pie"
          ? "Emissions by Sector"
          : "Carbon Price Trend (2018-2022)";
      case "transport":
        return activeTab === "bar"
          ? "Transport Indicators"
          : activeTab === "pie"
          ? "Transport Mode Distribution"
          : "EV Market Share Trend (2018-2022)";
      case "refugees & migration":
        return activeTab === "bar"
          ? "Migration Indicators"
          : activeTab === "pie"
          ? "Origin of Migrants"
          : "Asylum Applications Trend (2018-2022)";
      default:
        return activeTab === "bar"
          ? "Key Metrics"
          : activeTab === "pie"
          ? "Distribution"
          : "Trend (2018-2022)";
    }
  };

  // Get y-axis label based on indicator and chart type
  const getYAxisLabel = () => {
    if (activeTab !== "line") return "";

    switch (indicator) {
      case "gender equality":
        return "Pay Gap (%)";
      case "labour":
        return "Unemployment Rate (%)";
      case "marcoeconomy":
        return "GDP Growth (%)";
      case "health":
        return "Life Expectancy (years)";
      case "finance":
        return "Growth Rate (%)";
      case "subjective wellbeing":
        return "Satisfaction Score (0-10)";
      case "emission trading":
        return "Carbon Price (€/ton)";
      case "transport":
        return "EV Market Share (%)";
      case "refugees & migration":
        return "Applications (thousands)";
      default:
        return "Value";
    }
  };

  // Create bar chart using D3
  useEffect(() => {
    if (!barChartRef.current || activeTab !== "bar") return;

    const data = getData().bar;
    const svg = d3.select(barChartRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 30, right: 30, bottom: 70, left: 60 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add title
    svg
      .append("text")
      .attr("x", 250)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text(getChartTitle());

    // X axis
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(data.map((d) => d.name))
      .padding(0.2);

    chart
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Y axis
    interface BarChartMaxDatum {
      name: string;
      value: number;
    }
    const maxValue =
      d3.max<BarChartMaxDatum, number>(
        data,
        (d: BarChartMaxDatum) => d.value
      ) || 0;
    const y = d3
      .scaleLinear()
      .domain([0, maxValue * 1.2])
      .range([height, 0]);

    chart.append("g").call(d3.axisLeft(y));

    // Color scale
    const colorScale = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.name))
      .range(["#4f46e5", "#7c3aed", "#2563eb", "#8b5cf6", "#3b82f6"]);

    // Bars
    interface BarChartData {
      name: string;
      value: number;
    }

    chart
      .selectAll<SVGRectElement, BarChartData>("bars")
      .data(data) // <-- fix here: remove <BarChartData[]> and pass data directly
      .join("rect")
      .attr("x", (d: BarChartData) => x(d.name) || 0)
      .attr("y", (d: BarChartData) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d: BarChartData) => height - y(d.value))
      .attr("fill", (d: BarChartData) => colorScale(d.name) as string)
      .attr("rx", 4)
      .attr("ry", 4);

    // Add value labels on top of bars
    interface BarChartLabelData {
      name: string;
      value: number;
    }

    chart
      .selectAll<SVGTextElement, BarChartLabelData>(".text")
      .data(data) // or .data<BarChartLabelData>(data)
      .join("text")
      .attr("class", "label")
      .attr("text-anchor", "middle")
      .attr("x", (d: BarChartLabelData) => (x(d.name) || 0) + x.bandwidth() / 2)
      .attr("y", (d: BarChartLabelData) => y(d.value) - 5)
      .text((d: BarChartLabelData) => d.value)
      .style("font-size", "12px")
      .style("fill", "#4b5563");
  }, [indicator, activeTab]);

  // Create pie chart using D3
  useEffect(() => {
    if (!pieChartRef.current || activeTab !== "pie") return;

    const data = getData().pie;
    const svg = d3.select(pieChartRef.current);
    svg.selectAll("*").remove();

    const width = 500;
    const height = 300;
    const radius = Math.min(width, height) / 2 - 40;

    // Add title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text(getChartTitle());

    const chart = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2 + 10})`);

    // Color scale
    const colorScale = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.name))
      .range(["#4f46e5", "#7c3aed", "#2563eb", "#8b5cf6", "#3b82f6"]);

    // Compute the position of each group on the pie
    interface PieChartData {
      name: string;
      value: number;
    }

    const pie = d3
      .pie<PieChartData>()
      .value((d: PieChartData) => d.value)
      .sort(null);

    const pieData = pie(data);

    // Arc generator
    const arc = d3.arc<any>().innerRadius(0).outerRadius(radius);

    // Outer arc for labels
    const outerArc = d3
      .arc<any>()
      .innerRadius(radius * 1.1)
      .outerRadius(radius * 1.1);

    // Build the pie chart
    interface PieChartPieceDatum {
      data: {
        name: string;
        value: number;
      };
      startAngle: number;
      endAngle: number;
      padAngle: number;
      value: number;
      index: number;
    }

    chart
      .selectAll<SVGPathElement, PieChartPieceDatum>("pieces")
      .data(pieData) // or .data<PieChartPieceDatum>(pieData)
      .join("path")
      .attr("d", arc)
      .attr(
        "fill",
        (d: PieChartPieceDatum) => colorScale(d.data.name) as string
      )
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.8);

    // Add labels
    interface PieChartLabelDatum {
      data: {
        name: string;
        value: number;
      };
      startAngle: number;
      endAngle: number;
    }

    chart
      .selectAll<SVGTextElement, PieChartLabelDatum>("labels")
      .data(pieData)
      .join("text")
      .text((d: PieChartLabelDatum) => `${d.data.name}: ${d.data.value}%`)
      .attr("transform", (d: PieChartLabelDatum) => {
        const pos = outerArc.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.95 * (midAngle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .style("text-anchor", (d: PieChartLabelDatum) => {
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midAngle < Math.PI ? "start" : "end";
      })
      .style("font-size", "12px")
      .style("fill", "#4b5563");

    // Add polylines between chart and labels
    interface PieChartLineDatum {
      data: {
        name: string;
        value: number;
      };
      startAngle: number;
      endAngle: number;
    }

    chart
      .selectAll<SVGPolylineElement, PieChartLineDatum>("lines")
      .data(pieData) // or .data<PieChartLineDatum>(pieData)
      .join("polyline")
      .attr("stroke", "#4b5563")
      .style("fill", "none")
      .style("stroke-width", "1px")
      .attr("points", (d: PieChartLineDatum) => {
        const posA = arc.centroid(d);
        const posB = outerArc.centroid(d);
        const posC = outerArc.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        posC[0] = radius * 0.9 * (midAngle < Math.PI ? 1 : -1);
        const points = [posA, posB, posC]
          .map((point) => point.join(","))
          .join(" ");
        return points;
      });
  }, [indicator, activeTab]);

  // Create line chart using D3
  useEffect(() => {
    if (!lineChartRef.current || activeTab !== "line") return;

    const data = getData().line;
    const svg = d3.select(lineChartRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add title
    svg
      .append("text")
      .attr("x", 250)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text(getChartTitle());

    // X axis
    const x = d3.scaleLinear().domain([2018, 2022]).range([0, width]);

    interface LineChartData {
      year: number;
      value: number;
    }

    chart
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(x)
          .tickFormat((d: d3.NumberValue) => String(Number(d)))
          .ticks(5)
      )
      .append("text")
      .attr("x", width / 2)
      .attr("y", 40)
      .attr("fill", "#4b5563")
      .style("text-anchor", "middle")
      .text("Year");

    // Y axis
    interface LineChartMinMaxDatum {
      year: number;
      value: number;
    }
    const minValue =
      d3.min<LineChartMinMaxDatum, number>(
        data,
        (d: LineChartMinMaxDatum) => d.value
      ) || 0;
    interface LineChartMaxDatum {
      year: number;
      value: number;
    }
    const maxValue =
      d3.max<LineChartMaxDatum, number>(
        data,
        (d: LineChartMaxDatum) => d.value
      ) || 0;
    const padding = (maxValue - minValue) * 0.2;

    const y = d3
      .scaleLinear()
      .domain([Math.max(0, minValue - padding), maxValue + padding])
      .range([height, 0]);

    chart
      .append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -height / 2)
      .attr("fill", "#4b5563")
      .style("text-anchor", "middle")
      .text(getYAxisLabel());

    // Add the line
    interface LineChartDatum {
      year: number;
      value: number;
    }

    chart
      .append("path")
      .datum<LineChartDatum[]>(data)
      .attr("fill", "none")
      .attr("stroke", "#4f46e5")
      .attr("stroke-width", 3)
      .attr(
        "d",
        d3
          .line<LineChartDatum>()
          .x((d: LineChartDatum) => x(d.year))
          .y((d: LineChartDatum) => y(d.value))
          .curve(d3.curveMonotoneX)
      );

    // Add the points
    interface LineChartDotDatum {
      year: number;
      value: number;
    }

    chart
      .selectAll<SVGCircleElement, LineChartDotDatum>("dots")
      .data(data) // or .data<LineChartDotDatum>(data)
      .join("circle")
      .attr("cx", (d: LineChartDotDatum) => x(d.year))
      .attr("cy", (d: LineChartDotDatum) => y(d.value))
      .attr("r", 5)
      .attr("fill", "#4f46e5")
      .attr("stroke", "white")
      .attr("stroke-width", 2);

    // Add value labels
    interface LineChartLabelDatum {
      year: number;
      value: number;
    }

    chart
      .selectAll<SVGTextElement, LineChartLabelDatum>("labels")
      .data(data) // or .data<LineChartLabelDatum>(data)
      .join("text")
      .attr("x", (d: LineChartLabelDatum) => x(d.year))
      .attr("y", (d: LineChartLabelDatum) => y(d.value) - 10)
      .text((d: LineChartLabelDatum) => d.value)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#4b5563");
  }, [indicator, activeTab]);

  // Function to download the current chart as SVG
  const downloadChart = () => {
    let svgElement;
    if (activeTab === "bar") svgElement = barChartRef.current;
    else if (activeTab === "pie") svgElement = pieChartRef.current;
    else svgElement = lineChartRef.current;

    if (!svgElement) return;

    // Get the SVG data
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);

    // Create download link
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = `${indicator}-${activeTab}-chart.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  if (indicator === "all") {
    return null;
  }

  return (
    <Card className="mb-4 overflow-hidden border border-blue-100">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-gray-700 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
            {indicator.charAt(0).toUpperCase() + indicator.slice(1)}{" "}
            Visualization
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadChart}
            className="flex items-center gap-1 text-xs h-7 px-2"
          >
            <Download className="h-3 w-3" />
            <span>Export</span>
          </Button>
        </div>

        <Tabs
          defaultValue="bar"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="bar" className="text-xs">
              <BarChart3 className="h-3 w-3 mr-1" />
              Bar Chart
            </TabsTrigger>
            <TabsTrigger value="pie" className="text-xs">
              <PieChartIcon className="h-3 w-3 mr-1" />
              Pie Chart
            </TabsTrigger>
            <TabsTrigger value="line" className="text-xs">
              <LineChart className="h-3 w-3 mr-1" />
              Trend Line
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bar" className="mt-0">
            <div className="h-[300px] w-full overflow-x-auto">
              <svg
                ref={barChartRef}
                width="500"
                height="300"
                className="mx-auto"
              ></svg>
            </div>
          </TabsContent>

          <TabsContent value="pie" className="mt-0">
            <div className="h-[300px] w-full overflow-x-auto">
              <svg
                ref={pieChartRef}
                width="500"
                height="300"
                className="mx-auto"
              ></svg>
            </div>
          </TabsContent>

          <TabsContent value="line" className="mt-0">
            <div className="h-[300px] w-full overflow-x-auto">
              <svg
                ref={lineChartRef}
                width="500"
                height="300"
                className="mx-auto"
              ></svg>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
