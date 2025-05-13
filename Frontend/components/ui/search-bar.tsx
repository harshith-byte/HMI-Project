"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { SearchResults } from "@/components/search-results";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the search component to close results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearching(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Close search on Escape
      if (event.key === "Escape") {
        setIsSearching(false);
        setQuery("");
      }

      // Open search on Ctrl+K or Cmd+K
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        setIsSearching(true);
        document.getElementById("search-input")?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.trim()) {
      setIsSearching(true);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setIsSearching(false);
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="search-input"
          placeholder="Search trends, data, or reports... (Ctrl+K)"
          className="pl-10 w-full"
          value={query}
          onChange={handleSearch}
          onFocus={() => query.trim() && setIsSearching(true)}
        />
      </div>

      {isSearching && <SearchResults query={query} onClose={clearSearch} />}
    </div>
  );
}
