export type SlideType =
  | "cover"
  | "agenda"
  | "adoption-data"
  | "adoption-recommendation"
  | "next-steps"
  | "roadmap";

export type Trend = "up" | "down" | "flat";

export interface AdoptionMetric {
  label: string;
  current: number;
  previous: number;
  unit: "percent" | "count";
}

export interface Recommendation {
  title: string;
  detail: string;
}

export interface CustomerData {
  id: string;
  name: string;
  logoText: string;
  periodLabel: string;
  adoptionMetrics: AdoptionMetric[];
  recommendations: Recommendation[];
  nextSteps: string[];
  roadmapItems: string[];
}

export interface Slide {
  id: string;
  title: string;
  type: SlideType;
  section: "intro" | "adoption" | "planning";
  payload?: {
    metrics?: AdoptionMetric[];
    recommendations?: Recommendation[];
    bullets?: string[];
    periodLabel?: string;
    customerName?: string;
    customerLogoText?: string;
  };
}
