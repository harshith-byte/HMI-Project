"use client";
import {
  ArrowDown,
  ArrowUp,
  TrendingUp,
  Play,
  Pause,
  Volume2,
  Download,
  Loader2,
  FileText,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import load from "../styles/load.gif";
import { TrendCard } from "@/components/trend-card";
import { ChatBox } from "@/components/chat-box";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [trendData, setTrendData] = useState<string | null>(null);
  const [indicator, setIndicator] = useState("all");
  const [isPodcastGenerating, setIsPodcastGenerating] = useState(false);
  const [podcastAudio, setPodcastAudio] = useState<string | null>(null);
  const [podcastTranscript, setPodcastTranscript] = useState<string | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  type Trend = {
    title: string;
    value: string;
    description: string;
    trend: "up" | "down" | "flat";
  };

  const [trendList, setTrendList] = useState<Trend[]>([]);

  const prompts: Record<string, string> = {
    "gender equality": `List the top 3 gender equality indicators from the provided data. Return as a JSON array with \"title\", \"value\", \"description\", and \"trend\" (\"up\", \"down\", or \"flat\"). Respond only with valid JSON.`,
    labour: `Identify the top 3 labor market indicators based on the PDF. Return them as a JSON array with keys: \"title\", \"value\", \"description\", and \"trend\" (\"up\", \"down\", or \"flat\"). Only return the JSON.`,
    marcoeconomy: `From the macroeconomic data, extract the top 3 macroeconomic indicators for Germany. Provide them in JSON array format with keys: \"title\", \"value\", \"description\", and \"trend\" (\"up\", \"down\", or \"flat\"). Don't include markdown formatting.`,
    health: `List the top 3 health indicators for Germany based on the PDF. Present them in a clean JSON array with \"title\", \"value\", \"description\", and \"trend\" (\"up\", \"down\", \"flat\"). Avoid any markdown.`,
    finance: `Based on the financial data, extract the top 3 finance-related indicators. Format them in JSON with \"title\", \"value\", \"description\", and \"trend\" (\"up\", \"down\", or \"flat\"). No extra formatting.`,
    "subjective wellbeing": `Identify the top 3 indicators of subjective wellbeing from the document. Return only a JSON array with \"title\", \"value\", \"description\", and \"trend\" (\"up\", \"down\", or \"flat\").`,
    "emission trading": `List the 3 most important indicators or statistics related to emission trading. Provide a JSON array containing \"title\", \"value\", \"description\", and \"trend\" (\"up\", \"down\", or \"flat\"). JSON only.`,
    transport: `From the transport-related data, extract 3 key transport indicators. Return them as a JSON array with fields: \"title\", \"value\", \"description\", and \"trend\" (\"up\", \"down\", or \"flat\"). Do not wrap in markdown.`,
    "refugees & migration": `List the top 3 current indicators related to refugees and migration. Format as a JSON array with \"title\", \"value\", \"description\", and \"trend\" (\"up\", \"down\", or \"flat\"). Only return valid JSON.`,
  };

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;

      const updateTime = () => setCurrentTime(audio.currentTime);
      const handleLoadedMetadata = () => setDuration(audio.duration);
      const handleEnded = () => setIsPlaying(false);

      audio.addEventListener("timeupdate", updateTime);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("ended", handleEnded);

      return () => {
        audio.removeEventListener("timeupdate", updateTime);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, [podcastAudio]);

  const handleIndicatorChange = async (value: string) => {
    setIndicator(value);
    setLoading(true);
    setTrendData(null);
    setTrendList([]);
    setPodcastAudio(null);
    setPodcastTranscript(null);
    setShowTranscript(false);

    try {
      const indicatorRes = await fetch("http://127.0.0.1:5000/indicator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ indicator: value }),
      });

      const indicatorData = await indicatorRes.json();
      if (indicatorData.error) {
        console.error("Backend error:", indicatorData.error);
        return;
      }

      const query =
        prompts[value] ||
        "List the top 3 economic indicators in JSON format with title, value, description, and trend as 'up', 'down', or 'flat'. Only return the JSON array.";

      const searchRes = await fetch("http://127.0.0.1:5000/search_response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain_type: value,
          query,
        }),
      });

      const searchData = await searchRes.json();
      if (searchData.error) {
        console.error("Search error:", searchData.error);
        return;
      }

      setTrendData(searchData.response);

      try {
        const cleanedResponse = searchData.response
          .replace(/^```json\n/, "")
          .replace(/```$/, "")
          .trim();

        const parsed = JSON.parse(cleanedResponse);

        const extractedTrends = Array.isArray(parsed)
          ? parsed
          : Object.values(parsed).find((val) => Array.isArray(val)) || [];

        setTrendList(extractedTrends);
        console.log("Extracted trends:", extractedTrends);
      } catch (jsonErr) {
        console.error("Failed to parse trend data:", jsonErr);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const generatePodcast = async () => {
    if (!indicator || indicator === "all") return;

    setIsPodcastGenerating(true);
    setPodcastAudio(null);
    setPodcastTranscript(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/generate_podcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          indicator: indicator,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate podcast");
      }

      const data = await response.json();
      setPodcastAudio(data.audio_url);
      setPodcastTranscript(data.transcript);
    } catch (error) {
      console.error("Error generating podcast:", error);
    } finally {
      setIsPodcastGenerating(false);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (value: number[]) => {
    if (!audioRef.current) return;

    const newTime = value[0];
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const toggleTranscript = () => {
    setShowTranscript(!showTranscript);
  };

  const getIndicatorTitle = (ind: string) => {
    if (ind === "all") return "All Indicators";
    return ind.charAt(0).toUpperCase() + ind.slice(1);
  };

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

        <div className="grid gap-4 md:grid-cols-3">
          <Select
            defaultValue={indicator}
            onValueChange={handleIndicatorChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Indicator" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Indicators</SelectItem>
              <SelectItem value="gender equality">Gender Equality</SelectItem>
              <SelectItem value="labour">Labour</SelectItem>
              <SelectItem value="marcoeconomy">MacroEconomy</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="subjective wellbeing">
                Subjective WellBeing
              </SelectItem>
              <SelectItem value="emission trading">Emission Trading</SelectItem>
              <SelectItem value="transport">Transport</SelectItem>
              <SelectItem value="refugees & migration">
                Refugees And Migration
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Trends Section */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-bold tracking-tight">
          {indicator === "all" ? "Featured Trends" : "Quick Insight"}
        </h2>

        {loading ? (
          <div className="p-4 rounded-xl shadow text-center text-sm text-muted-foreground">
            <img
              src={load.src || "/placeholder.svg"}
              alt="Loading..."
              className="mx-auto w-20 h-20"
            />
            <p className="mt-2">Fetching trends...</p>
          </div>
        ) : trendList.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {trendList.map((trend, index) => (
              <TrendCard
                key={index}
                title={trend.title}
                value={trend.value}
                trend={trend.trend === "flat" ? "neutral" : trend.trend}
                icon={
                  trend.trend === "up" ? (
                    <ArrowUp className="h-4 w-4 text-red-500" />
                  ) : trend.trend === "down" ? (
                    <ArrowDown className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                  )
                }
                description={trend.description}
              />
            ))}
          </div>
        ) : indicator === "all" ? (
          <div className="grid gap-4 md:grid-cols-3">
            <TrendCard
              title="Current Inflation"
              value="4.2%"
              trend="up"
              icon={<ArrowUp className="h-4 w-4 text-red-500" />}
              description="Increased by 0.3% from previous quarter"
            />
            <TrendCard
              title="Unemployment Rate"
              value="6.1%"
              trend="down"
              icon={<ArrowDown className="h-4 w-4 text-green-500" />}
              description="Decreased by 0.2% from previous quarter"
            />
            <TrendCard
              title="GDP Growth"
              value="+0.9%"
              trend="up"
              icon={<TrendingUp className="h-4 w-4 text-green-500" />}
              description="Increased by 0.4% from previous quarter"
            />
          </div>
        ) : trendData ? (
          <div className="bg-muted p-4 rounded-xl shadow">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {trendData}
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No trends found.</p>
        )}
      </section>

      {/* Podcast Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold tracking-tight">
            Listen to Podcast
          </h2>
          {!isPodcastGenerating && !podcastAudio && indicator !== "all" && (
            <Button
              onClick={generatePodcast}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Generate Podcast
            </Button>
          )}
        </div>

        {isPodcastGenerating ? (
          <div className="bg-muted p-6 rounded-xl shadow flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-2" />
            <p className="text-muted-foreground">
              Generating podcast from data...
            </p>
          </div>
        ) : podcastAudio ? (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl shadow">
              <audio ref={audioRef} src={podcastAudio} className="hidden" />

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Button
                    onClick={togglePlayPause}
                    size="icon"
                    variant="ghost"
                    className="h-12 w-12 rounded-full bg-purple-600 text-white hover:bg-purple-700 mr-4"
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6" />
                    )}
                  </Button>
                  <div>
                    <h3 className="font-medium">
                      {getIndicatorTitle(indicator)} Insights
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Economic trends podcast
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleTranscript}
                    title="View transcript"
                    className="flex items-center gap-1"
                  >
                    <FileText className="h-4 w-4" />
                    <span>{showTranscript ? "Hide" : "Show"} Transcript</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.open(podcastAudio, "_blank")}
                    title="Download podcast"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    value={[currentTime]}
                    max={duration || 100}
                    step={0.1}
                    onValueChange={handleSliderChange}
                    className="flex-1"
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>

            {showTranscript && podcastTranscript && (
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-900">Transcript</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowTranscript(false)}
                      className="h-6 w-6"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-line text-gray-700">
                      {podcastTranscript}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="bg-muted p-6 rounded-xl shadow text-center">
            <Volume2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">
              {indicator !== "all"
                ? "Select 'Generate Podcast' to create an audio summary of the current data."
                : "Select a specific indicator to generate a podcast."}
            </p>
          </div>
        )}
      </section>

      {/* Chat Section */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-bold tracking-tight">
          Ask About the Data
        </h2>
        <ChatBox indicator={indicator} />
      </section>
    </div>
  );
}
