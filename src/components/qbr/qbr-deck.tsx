"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerData, Slide } from "@/types/qbr";
import { buildQbrSlides } from "@/lib/build-slides";

function LogoDot({ text }: { text: string }) {
  return (
    <div className="grid h-10 w-10 place-items-center rounded-full border border-orange-400/40 bg-orange-500/10 text-xs font-semibold text-orange-200">
      {text}
    </div>
  );
}

function SlideCanvas({ slide }: { slide: Slide }) {
  const kpiNarrative = (
    current: number,
    previous: number,
    unit: "percent" | "count" | "minutes",
    improved: boolean | null,
  ) => {
    const suffix = unit === "percent" ? "%" : unit === "minutes" ? " min" : "";
    const movement = improved === null ? "held steady" : improved ? "improved" : "declined";
    return `This quarter moved from ${previous}${suffix} to ${current}${suffix} and ${movement} versus last quarter.`;
  };

  if (slide.type === "cover") {
    return (
      <Card className="h-full border border-orange-500/25 bg-[#0c0f22]/85 shadow-[0_0_70px_rgba(255,95,40,0.12)] backdrop-blur-xl">
        <CardHeader className="flex h-full flex-col justify-between gap-8 p-6 md:p-10">
          <div className="space-y-5">
            <Badge className="w-fit border-orange-400/40 bg-orange-500/10 text-orange-200">Executive QBR</Badge>
            <CardTitle className="max-w-2xl font-mono text-3xl leading-tight text-slate-50 md:text-5xl">
              {slide.title}
            </CardTitle>
            <CardDescription className="text-lg text-slate-300">{slide.payload.customerName}</CardDescription>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <LogoDot text={slide.payload.customerLogoText} />
            <span>+</span>
            <Image src="/coderabbit-logo-dark.svg" alt="CodeRabbit" width={160} height={32} className="h-8 w-auto" />
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="flex h-full flex-col overflow-hidden border border-slate-700/80 bg-[#0d1124]/90 shadow-[0_0_60px_rgba(14,22,60,0.6)] backdrop-blur-xl">
      <CardHeader className="shrink-0 space-y-3 p-5 md:p-8">
        <Badge className="w-fit border-slate-600 bg-slate-800/80 text-slate-200">{slide.section.toUpperCase()}</Badge>
        <CardTitle className="font-mono text-2xl leading-tight text-slate-50 md:text-4xl">{slide.title}</CardTitle>
        {slide.type === "adoption-data" ? (
          <CardDescription className="text-slate-300">Reporting period: {slide.payload.periodLabel}</CardDescription>
        ) : null}
      </CardHeader>

      <CardContent
        className="min-h-0 overflow-y-auto p-5 pt-0 outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70 md:p-8 md:pt-0"
        tabIndex={0}
        role="region"
        aria-label={`${slide.title} content`}
        data-slide-scroll-region="true"
      >
        {slide.type === "agenda" ? (
          <ul className="grid gap-3 text-sm text-slate-200 md:grid-cols-2 md:text-base">
            {slide.payload.bullets.map((item, index) => (
              <li key={`${index}-${item}`} className="rounded-xl border border-slate-700 bg-[#0a1128] px-4 py-4">
                <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-orange-200">
                  Topic {index + 1}
                </span>
                <p className="mt-2 text-sm leading-relaxed text-slate-100 md:text-base">{item}</p>
              </li>
            ))}
          </ul>
        ) : null}

        {slide.type === "adoption-data" ? (
          <div className="grid gap-3 md:grid-cols-2">
            {slide.payload.metrics.map((metric) => {
              const diff = metric.current - metric.previous;
              const improved = diff === 0 ? null : metric.unit === "minutes" ? diff < 0 : diff > 0;
              const diffLabel = `${diff > 0 ? "+" : ""}${diff}${metric.unit === "percent" ? "%" : metric.unit === "minutes" ? " min" : ""}`;
              const statusClass = improved === null ? "text-slate-400" : improved ? "text-emerald-300" : "text-orange-300";
              const statusLabel = improved === null ? "No change" : improved ? "Improved" : "Declined";

              return (
                <div key={metric.label} className="rounded-xl border border-slate-700 bg-[#090d1d] p-4">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-orange-200">KPI</p>
                  <p className="mt-2 text-base font-semibold text-slate-100">{metric.label}</p>
                  <p className="mt-2 font-mono text-3xl text-slate-100">
                    {metric.current}
                    {metric.unit === "percent" ? "%" : metric.unit === "minutes" ? " min" : ""}
                  </p>
                  <p className={`mt-2 text-sm ${statusClass}`}>
                    {statusLabel} ({diffLabel})
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    {kpiNarrative(metric.current, metric.previous, metric.unit, improved)}
                  </p>
                </div>
              );
            })}
          </div>
        ) : null}

        {slide.type === "adoption-recommendation" ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-700/80 bg-slate-900/35 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.16em] text-orange-300">Recommendation Focus</p>
              <p className="mt-1 text-sm text-slate-300">
                Prioritized best practices to improve review quality, consistency, and cross-team adoption.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {slide.payload.recommendations.map((recommendation, index) => (
                <div
                  key={recommendation.title}
                  className="relative overflow-hidden rounded-xl border border-slate-700 bg-[#0a1128] p-4"
                >
                  <span className="inline-flex items-center rounded-full border border-orange-300/30 bg-orange-500/15 px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-orange-200">
                    Highlight {index + 1}
                  </span>
                  <p className="mt-3 font-medium text-slate-100">{recommendation.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{recommendation.detail}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {slide.type === "next-steps" || slide.type === "roadmap" ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-700/80 bg-slate-900/35 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.16em] text-orange-300">
                {slide.type === "next-steps" ? "Execution Priorities" : "Roadmap Priorities"}
              </p>
              <p className="mt-1 text-sm text-slate-300">
                {slide.type === "next-steps"
                  ? "Immediate actions to convert insights into measurable delivery outcomes."
                  : "Upcoming investments to scale quality and impact across engineering."}
              </p>
            </div>

            <ul className="grid gap-3 text-sm text-slate-200 md:grid-cols-2 md:text-base">
              {slide.payload.items.map((item, index) => (
                <li key={`${index}-${item.headline}`} className="rounded-xl border border-slate-700 bg-[#0a1128] px-4 py-4">
                  {slide.type === "next-steps" ? (
                    <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-orange-200">
                      {`Step ${index + 1}`}
                    </span>
                  ) : null}
                  <p className="mt-2 text-sm font-semibold text-slate-100 md:text-base">{item.headline}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function QbrDeck({ customer }: { customer: CustomerData }) {
  const slides = useMemo(() => buildQbrSlides(customer), [customer]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isInteractive =
        tag === "input" ||
        tag === "textarea" ||
        tag === "button" ||
        tag === "select" ||
        tag === "a" ||
        target?.isContentEditable;

      if (isInteractive) {
        return;
      }

      const activeElement = document.activeElement as HTMLElement | null;
      if (activeElement?.closest('[data-slide-scroll-region="true"]')) {
        return;
      }

      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        setActiveIndex((current) => Math.min(current + 1, slides.length - 1));
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((current) => Math.max(current - 1, 0));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [slides.length]);

  const activeSlide = slides[activeIndex];

  return (
    <main className="coderabbit-grid-bg relative min-h-dvh w-full overflow-hidden text-slate-100">
      <div aria-hidden="true" className="coderabbit-grid-overlay pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[1800px] flex-col px-3 pb-4 pt-3 md:px-6 md:pb-6 md:pt-5">
        <header className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-slate-700/80 bg-[#080c1d]/75 px-3 py-2 backdrop-blur md:mb-5 md:px-4 md:py-3">
          <div className="flex items-center gap-3">
            <Image src="/coderabbit-logo-dark.svg" alt="CodeRabbit" width={140} height={28} className="h-7 w-auto" />
            <span className="text-xs text-slate-400 md:text-sm">{customer.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="border-slate-600 bg-transparent text-slate-200 hover:bg-slate-800"
              onClick={() => setActiveIndex((current) => Math.max(current - 1, 0))}
              disabled={activeIndex === 0}
            >
              Prev
            </Button>
            <Button
              className="bg-orange-500 text-black hover:bg-orange-400"
              onClick={() => setActiveIndex((current) => Math.min(current + 1, slides.length - 1))}
              disabled={activeIndex === slides.length - 1}
            >
              Next
            </Button>
            <Button asChild variant="ghost" className="text-slate-300 hover:bg-slate-800">
              <Link href="/">Exit</Link>
            </Button>
          </div>
        </header>

        <section className="flex-1">
          <div className="h-[72dvh] md:h-[78dvh]" aria-live="polite" aria-atomic="true" role="region" aria-label="Slide canvas">
            {activeSlide ? <SlideCanvas key={activeIndex} slide={activeSlide} /> : null}
          </div>
        </section>

        <footer className="mt-3 flex items-center justify-between rounded-xl border border-slate-700/80 bg-[#080c1d]/75 px-3 py-2 text-xs text-slate-400 backdrop-blur md:mt-5 md:text-sm">
          <p>Use Arrow Left/Right or Space to navigate</p>
          <p>
            Slide {activeIndex + 1} / {slides.length}
          </p>
        </footer>
      </div>
    </main>
  );
}
