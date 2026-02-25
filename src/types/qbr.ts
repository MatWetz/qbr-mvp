export type SlideType =
  | "cover"
  | "agenda"
  | "adoption-data"
  | "adoption-recommendation"
  | "next-steps"
  | "roadmap";

export type SlideSection = "intro" | "adoption" | "planning";

export interface AdoptionMetric {
  label: string;
  current: number;
  previous: number;
  unit: "percent" | "count" | "minutes";
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

interface BaseSlide<TType extends SlideType, TPayload> {
  id: string;
  title: string;
  type: TType;
  section: SlideSection;
  payload: TPayload;
}

export type CoverSlide = BaseSlide<
  "cover",
  {
    customerName: string;
    customerLogoText: string;
  }
>;

export type AgendaSlide = BaseSlide<
  "agenda",
  {
    bullets: string[];
  }
>;

export type AdoptionDataSlide = BaseSlide<
  "adoption-data",
  {
    metrics: AdoptionMetric[];
    periodLabel: string;
  }
>;

export type AdoptionRecommendationSlide = BaseSlide<
  "adoption-recommendation",
  {
    recommendations: Recommendation[];
  }
>;

export type NextStepsSlide = BaseSlide<
  "next-steps",
  {
    bullets: string[];
  }
>;

export type RoadmapSlide = BaseSlide<
  "roadmap",
  {
    bullets: string[];
  }
>;

export type Slide =
  | CoverSlide
  | AgendaSlide
  | AdoptionDataSlide
  | AdoptionRecommendationSlide
  | NextStepsSlide
  | RoadmapSlide;
