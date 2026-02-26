import { CustomerData, Slide } from "@/types/qbr";

const METRIC_SLIDE_LIMIT = 8;

function firstEightMetrics(metrics: CustomerData["adoptionMetrics"]) {
  return metrics.slice(0, METRIC_SLIDE_LIMIT);
}

export function buildQbrSlides(customer: CustomerData): Slide[] {
  const prioritizedMetrics = firstEightMetrics(customer.adoptionMetrics);
  const metricsMidpoint = Math.ceil(prioritizedMetrics.length / 2);
  const [firstDataSet, secondDataSet] = [
    prioritizedMetrics.slice(0, metricsMidpoint),
    prioritizedMetrics.slice(metricsMidpoint),
  ];

  const recommendationsMidpoint = Math.ceil(customer.recommendations.length / 2);
  const [firstRecommendations, secondRecommendations] = [
    customer.recommendations.slice(0, recommendationsMidpoint),
    customer.recommendations.slice(recommendationsMidpoint),
  ];

  const slides: Slide[] = [
    {
      id: "cover",
      type: "cover",
      title: "Quarterly Business Review",
      section: "intro",
      payload: {
        customerName: customer.name,
        customerLogoText: customer.logoText,
      },
    },
  ];

  if (firstDataSet.length > 0) {
    slides.push({
      id: "adoption-data-1",
      type: "adoption-data",
      title: "Adoption Review: Usage Signals",
      section: "adoption",
      payload: {
        metrics: firstDataSet,
        periodLabel: customer.periodLabel,
      },
    });
  }

  if (secondDataSet.length > 0) {
    slides.push({
      id: "adoption-data-2",
      type: "adoption-data",
      title: "Adoption Review: Outcomes",
      section: "adoption",
      payload: {
        metrics: secondDataSet,
        periodLabel: customer.periodLabel,
      },
    });
  }

  if (firstRecommendations.length > 0) {
    slides.push({
      id: "adoption-reco-1",
      type: "adoption-recommendation",
      title: "Recommendations: Adoption Levers",
      section: "adoption",
      payload: {
        recommendations: firstRecommendations,
      },
    });
  }

  if (secondRecommendations.length > 0) {
    slides.push({
      id: "adoption-reco-2",
      type: "adoption-recommendation",
      title: "Recommendations: Process Levers",
      section: "adoption",
      payload: {
        recommendations: secondRecommendations,
      },
    });
  }

  slides.push({
    id: "next-steps",
    type: "next-steps",
    title: "Next Steps",
    section: "planning",
    payload: {
      items: customer.nextSteps,
    },
  });

  slides.push({
    id: "roadmap",
    type: "roadmap",
    title: "Roadmap Highlights",
    section: "planning",
    payload: {
      items: customer.roadmapItems,
    },
  });

  const agendaBullets = slides
    .filter((slide) => slide.type !== "cover")
    .map((slide) => slide.title);

  slides.splice(1, 0, {
    id: "agenda",
    type: "agenda",
    title: "Agenda",
    section: "intro",
    payload: {
      bullets: agendaBullets,
    },
  });

  return slides;
}
