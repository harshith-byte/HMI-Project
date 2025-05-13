"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">DIW Data Narrator</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80"
            >
              Home
            </Link>
            <Link
              href="/explore-data"
              className="transition-colors hover:text-foreground/80"
            >
              Explore Data
            </Link>
            <Link
              href="/audio-reports"
              className="transition-colors hover:text-foreground/80"
            >
              Audio Reports
            </Link>
            {/* <Link
              href="#"
              className="transition-colors hover:text-foreground/80"
            >
              About
            </Link> */}
          </nav>

          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="h-5 w-5" />
                  <span className="sr-only">Toggle language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => {}}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}}>German</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <ThemeToggle />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="flex flex-col space-y-4 mt-6">
                  <Link
                    href="/"
                    className="text-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/explore-data"
                    className="text-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Explore Data
                  </Link>
                  <Link
                    href="/audio-reports"
                    className="text-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Audio Reports
                  </Link>
                  <Link
                    href="#"
                    className="text-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    About
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
