"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, HelpCircle } from "lucide-react";
import Markdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

type ChatBoxProps = {
  indicator: string;
};

export function ChatBox({ indicator }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "Hello! I'm your economic data assistant. Ask me anything about German economic indicators.",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [recommendedQuestions, setRecommendedQuestions] = useState<string[]>(
    []
  );
  const [loadingSummary, setLoadingSummary] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Map indicator to sourceId
  const sourceIds: Record<string, string> = {
    "gender equality": "src_xu8lVC3Qox6kchRnG1cq6",
    labour: "src_gQvco3ftB6bUJ9gQ8u66Y",
    macroeconomy: "src_YCJY5mElz4tfQiwklzt9g",
    health: "src_6KqG7PmDuA8DNejTYQyJa",
    finance: "src_4rs5HOMGVDOErQe10Kafd",
    "subjective wellbeing": "src_y1X9pr5NL2Aer3UI1ydzj",
    "emission trading": "src_ZILm5QI9VzVQUgMRSpE2w",
    transport: "src_617Hb0pwT8lZQiNi0SaCf",
    "refugees & migration": "src_WR0PhkuLfSAcRq6mjQO3k",
  };

  // Get the sourceId for the selected indicator, fallback to macroeconomy if unknown
  const sourceId =
    sourceIds[indicator.toLowerCase()] || sourceIds["macroeconomy"];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch summary and recommended questions when indicator changes
  useEffect(() => {
    // Reset messages when indicator changes
    setMessages([
      {
        id: "welcome",
        content: `Hello! I'm your economic data assistant. Ask me anything about ${
          indicator === "all" ? "German economic indicators" : indicator
        } data.`,
        role: "assistant",
        timestamp: new Date(),
      },
    ]);

    // Don't fetch for "all" indicators
    if (indicator !== "all") {
      fetchSummaryAndQuestions(indicator);
    } else {
      // Clear summary and questions for "all"
      setSummary(null);
      setRecommendedQuestions([]);
    }
  }, [indicator]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const fetchSummaryAndQuestions = async (indicatorType: string) => {
    setLoadingSummary(true);
    try {
      const response = await fetch("http://localhost:5000/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain_type: indicatorType.toLowerCase(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch summary");
      }

      const data = await response.json();
      setSummary(data.summary);
      setRecommendedQuestions(data.recommended_questions || []);
    } catch (error) {
      console.error("Error fetching summary:", error);
      setSummary("Sorry, couldn't fetch the summary for this indicator.");
      setRecommendedQuestions([]);
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain_type: indicator.toLowerCase(),
          query: input,
        }),
      });

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "Sorry, I couldn't understand that.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: "❌ Failed to fetch data. Please try again later.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const askRecommendedQuestion = (question: string) => {
    if (!question.trim()) return;

    // Set the input to the question
    setInput(question);

    // Submit the form programmatically
    const event = {
      preventDefault: () => {},
    } as React.FormEvent;

    handleSubmit(event);
  };

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-0">
        <div className="flex flex-col h-[600px]">
          {/* Summary section */}
          {indicator !== "all" && (
            <div className="bg-blue-50 p-4 border-b border-blue-100">
              {loadingSummary ? (
                <div className="flex items-center justify-center p-4">
                  <div className="h-4 w-4 rounded-full bg-blue-600 animate-pulse mr-2"></div>
                  <p className="text-sm text-blue-600">Loading summary...</p>
                </div>
              ) : summary ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-blue-800">
                      Summary
                    </h3>
                    <div className="text-sm text-gray-700">
                      <Markdown>{summary}</Markdown>
                    </div>
                  </div>

                  {recommendedQuestions.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-blue-800 flex items-center">
                        <HelpCircle className="h-3 w-3 mr-1" />
                        Suggested Questions
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {recommendedQuestions.map((question, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
                            onClick={() => askRecommendedQuestion(question)}
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No summary available for this indicator.
                </p>
              )}
            </div>
          )}

          {/* Chat messages area */}
          <div
            ref={scrollAreaRef}
            className="flex-1 p-4 overflow-y-auto"
            style={{ height: "320px" }}
          >
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[80%] ${
                      message.role === "user"
                        ? "flex-row-reverse space-x-reverse"
                        : ""
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 rounded-full p-2 ${
                        message.role === "user" ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="h-4 w-4 text-primary-foreground" />
                      ) : (
                        <Bot className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div
                      className={`rounded-lg px-3 py-2 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <div className="text-sm">
                        <Markdown>{message.content}</Markdown>
                      </div>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 max-w-[80%]">
                    <div className="flex-shrink-0 rounded-full p-2 bg-muted">
                      <Bot className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="rounded-lg px-3 py-2 bg-muted text-foreground">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-foreground/30 animate-pulse"></div>
                        <div className="h-2 w-2 rounded-full bg-foreground/30 animate-pulse delay-150"></div>
                        <div className="h-2 w-2 rounded-full bg-foreground/30 animate-pulse delay-300"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input area */}
          <div className="border-t p-4 bg-background">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <div className="relative flex-1">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ask about ${indicator} data...`}
                  className="pr-10"
                  disabled={isLoading}
                />
                <Sparkles className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
