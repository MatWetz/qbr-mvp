"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { mockCustomers } from "@/data/mock-customers";
import { buildQbrSlides } from "@/lib/build-slides";
import { getCustomerByQuery } from "@/lib/get-customer";
import { AdoptionMetric, Recommendation, Slide } from "@/types/qbr";

function formatMetricValue(metric: AdoptionMetric): string {
  if (metric.unit === "percent") {
    return `${metric.current}%`;
  }

  if (metric.unit === "minutes") {
    return `${metric.current} min`;
  }

  return `${metric.current}`;
}

function metricTrend(metric: AdoptionMetric): { label: string; tone: "default" | "secondary" | "destructive" } {
  const diff = metric.current - metric.previous;

  if (diff === 0) {
    return { label: "No change", tone: "secondary" };
  }

  const improved = metric.label === "Avg. Review Turnaround" ? diff < 0 : diff > 0;
  const prefix = diff > 0 ? "+" : "";
  const suffix = metric.unit === "percent" ? "%" : metric.unit === "minutes" ? " min" : "";
  return {
    label: `${improved ? "Improved" : "Declined"} (${prefix}${diff}${suffix})`,
    tone: improved ? "default" : "destructive",
  };
}

function LogoMark({ text, compact = false }: { text: string; compact?: boolean }) {
  return (
    <div
      className={`grid place-items-center rounded-full bg-gradient-to-br from-cyan-500 to-lime-400 font-semibold text-slate-900 ${compact ? "h-10 w-10 text-xs" : "h-20 w-20 text-xl"}`}
    >
      {text}
    </div>
  );
}

function RecommendationsList({ recommendations }: { recommendations: Recommendation[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {recommendations.map((recommendation) => (
        <Card key={recommendation.title} className="border-slate-200/80 bg-white/90">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">{recommendation.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">{recommendation.detail}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function DataList({ metrics }: { metrics: AdoptionMetric[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {metrics.map((metric) => {
        const trend = metricTrend(metric);
        return (
          <Card key={metric.label} className="border-slate-200/80 bg-white/90">
            <CardHeader className="space-y-2">
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="text-4xl font-semibold tracking-tight text-slate-900">
                {formatMetricValue(metric)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={trend.tone}>
                {trend.label}
              </Badge>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3 text-slate-700">
      {items.map((item) => (
        <li key={item} className="flex gap-3 rounded-lg border border-slate-200/70 bg-white/90 px-4 py-3">
          <span className="mt-1 h-2 w-2 rounded-full bg-cyan-500" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SlideCanvas({ slide }: { slide: Slide }) {
  if (slide.type === "cover") {
    return (
      <Card className="h-full border-slate-200/80 bg-white/90">
        <CardHeader className="gap-8 md:flex-row md:items-start md:justify-between">
          <div className="space-y-4">
            <Badge variant="secondary">Customer Success QBR</Badge>
            <CardTitle className="text-4xl tracking-tight text-slate-900">{slide.title}</CardTitle>
            <CardDescription className="text-base text-slate-700">{slide.payload.customerName}</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <LogoMark text={slide.payload.customerLogoText} />
            <span className="text-2xl text-slate-400">+</span>
            <LogoMark text="CR" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="max-w-xl text-slate-600">
            Quarterly executive review focused on adoption outcomes, action recommendations, and joint planning.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-slate-200/80 bg-white/90">
      <CardHeader>
        <Badge className="w-fit" variant="secondary">
          {slide.section.toUpperCase()}
        </Badge>
        <CardTitle className="text-3xl tracking-tight text-slate-900">{slide.title}</CardTitle>
        {slide.type === "adoption-data" ? <CardDescription>{slide.payload.periodLabel}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        {slide.type === "agenda" ? <BulletList items={slide.payload.bullets} /> : null}
        {slide.type === "adoption-data" ? <DataList metrics={slide.payload.metrics} /> : null}
        {slide.type === "adoption-recommendation" ? (
          <RecommendationsList recommendations={slide.payload.recommendations} />
        ) : null}
        {slide.type === "next-steps" ? <BulletList items={slide.payload.bullets} /> : null}
        {slide.type === "roadmap" ? <BulletList items={slide.payload.bullets} /> : null}
      </CardContent>
    </Card>
  );
}

export function QbrBuilder() {
  const [query, setQuery] = useState("");
  const [slides, setSlides] = useState<Slide[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const activeSlide = slides[activeIndex];
  const hasDeck = slides.length > 0;

  const lookupExamples = useMemo(
    () => mockCustomers.map((customer) => customer.name).join(", "),
    [],
  );

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!hasDeck) {
      return;
    }

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

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const customer = await getCustomerByQuery(query);
      if (!isMounted.current) {
        return;
      }

      if (!customer) {
        setSlides([]);
        setError("No mock customer found. Try one of the sample names below.");
        return;
      }

      const nextSlides = buildQbrSlides(customer);
      setSlides(nextSlides);
      setActiveIndex(0);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-8">
      <Card className="border-slate-200/80 bg-white/90">
        <CardHeader>
          <Badge className="w-fit bg-slate-900 text-slate-50 hover:bg-slate-900">QBR Deck Builder</Badge>
          <CardTitle className="text-2xl text-slate-900">Generate slides by customer name</CardTitle>
          <CardDescription>
            Enter a customer, fetch mock data, and generate the full QBR slide sequence.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <form className="flex flex-col gap-3 md:flex-row" onSubmit={onSubmit}>
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Example: Acme Health"
              className="bg-white"
              aria-label="Customer Name"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Generating..." : "Generate QBR"}
            </Button>
          </form>
          <p className="text-sm text-slate-600">Available mock customers: {lookupExamples}</p>
          {error ? (
            <p className="text-sm text-red-600" role="alert" aria-live="assertive">
              {error}
            </p>
          ) : null}
        </CardContent>
      </Card>

      {hasDeck ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setActiveIndex((current) => Math.max(current - 1, 0))}
                disabled={activeIndex === 0}
              >
                Previous
              </Button>
              <Button
                onClick={() => setActiveIndex((current) => Math.min(current + 1, slides.length - 1))}
                disabled={activeIndex === slides.length - 1}
              >
                Next
              </Button>
            </div>
            <div className="text-sm text-slate-600">
              Slide {activeIndex + 1} / {slides.length}
            </div>
          </div>

          <Separator />

          <div className="min-h-[420px]">
            {activeSlide ? <SlideCanvas slide={activeSlide} /> : null}
          </div>

          <p className="text-sm text-slate-500">Use Arrow Left/Right or Space to control slides.</p>
        </section>
      ) : (
        <Card className="border-dashed border-slate-300 bg-white/70">
          <CardContent className="pt-6 text-sm text-slate-600">
            Generate a deck to preview slides. The current flow includes cover, agenda, four adoption slides,
            next steps, and roadmap.
          </CardContent>
        </Card>
      )}
    </main>
  );
}
