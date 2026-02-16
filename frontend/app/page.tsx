"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Wind,
  Zap,
  Menu,
  X,
  Github,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between w-full px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg sm:text-xl tracking-tight hover:opacity-80 transition-opacity"
          >
            <Wind className="size-5 sm:size-6 text-primary" />
            <span>OpenOA Cloud</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link
              href="/analysis"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <div className="h-4 w-px bg-border" />
            <ModeToggle />
          </nav>

          {/* Mobile Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative z-50"
            >
              <span className="sr-only">Toggle menu</span>
              <Menu
                className={`h-5 w-5 absolute transition-all duration-300 ${mobileMenuOpen ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"}`}
              />
              <X
                className={`h-5 w-5 absolute transition-all duration-300 ${mobileMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"}`}
              />
            </Button>
          </div>
        </div>
      </header>

      {/* Full-screen Mobile Navigation Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-background/80 backdrop-blur-xl transition-opacity duration-500 ${mobileMenuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Nav content */}
        <nav className="relative flex flex-col items-center justify-center h-full gap-2 px-6">
          {[
            {
              href: "/analysis",
              label: "Dashboard",
              icon: LayoutDashboard,
              delay: "delay-150",
            },
            {
              href: "https://github.com/1mansri/Subhag-OpenOA-Assignment",
              label: "GitHub",
              icon: Github,
              delay: "delay-200",
              external: true,
            },
          ].map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              onClick={() => setMobileMenuOpen(false)}
              className={`group flex items-center gap-4 w-full max-w-xs rounded-2xl px-6 py-4 transition-all duration-500 ${item.delay} ${mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} hover:bg-muted/60`}
            >
              <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <item.icon className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold tracking-tight">
                  {item.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {i === 0 && "What we offer"}
                  {i === 1 && "AEP Analysis"}
                  {i === 2 && "Source code"}
                </span>
              </div>
            </Link>
          ))}

          {/* CTA in mobile menu */}
          <div
            className={`mt-6 w-full max-w-xs transition-all duration-500 delay-300 ${mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <Button
              size="lg"
              asChild
              className="w-full h-12 rounded-full font-semibold shadow-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link href="/analysis">
                Launch Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </nav>
      </div>

      {/* Hero */}
      <section className="relative w-full py-20 sm:py-24 px-4 md:px-6 overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>

        <div className="container mx-auto max-w-6xl text-center space-y-8 md:space-y-10">
          <div className="inline-flex items-center rounded-full border bg-muted/50 backdrop-blur-sm px-3 py-1 text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-1000 shadow-sm">
            <Zap className="mr-2 size-3.5 fill-primary text-primary" />
            <span>Modern Wind Energy Analysis</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl animate-in fade-in slide-in-from-bottom-6 duration-1000 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text px-4">
            Precision Analytics <br className="hidden sm:inline" />
            <span className="text-primary">for Wind Power</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground text-base sm:text-lg md:text-xl font-medium animate-in fade-in slide-in-from-bottom-8 delay-200 duration-1000 leading-relaxed px-4">
            Open-source operational assessment powered by OpenOA. Quantify AEP
            uncertainty and optimize performance with real-world SCADA data.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-10 delay-500 duration-1000 pt-4 md:pt-6 px-4">
            <Button
              size="lg"
              asChild
              className="h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg font-semibold rounded-full shadow-xl hover:shadow-primary/20 hover:scale-105 transition-all active:scale-95"
            >
              <Link href="/analysis">
                Launch Dashboard{" "}
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg font-semibold rounded-full border-2 hover:bg-muted hover:scale-105 transition-all active:scale-95"
            >
              <Link
                href="https://github.com/1mansri/Subhag-OpenOA-Assignment"
                target="_blank"
              >
                View on GitHub
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-4 border-t bg-background">
        <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="flex items-center gap-2">
            <Wind className="size-5 text-primary" />
            <span className="text-sm font-bold tracking-tight">
              OpenOA Cloud
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium text-center">
            Built with Next.js, FastAPI, and OpenOA
          </p>
        </div>
      </footer>
    </div>
  );
}
