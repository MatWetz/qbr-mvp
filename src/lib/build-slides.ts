import { CustomerData, Slide } from "@/types/qbr";

export function buildQbrSlides(customer: CustomerData): Slide[] {
  const [firstDataSet, secondDataSet] = [
    customer.adoptionMetrics.slice(0, 2),
    customer.adoptionMetrics.slice(2),
  ];

  const [firstRecommendations, secondRecommendations] = [
    customer.recommendations.slice(0, 2),
    customer.recommendations.slice(2),
  ];

  return [
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
    {
      id: "agenda",
      type: "agenda",
      title: "Agenda",
      section: "intro",
      payload: {
        bullets: [
          "Welcome and goals",
          "Adoption review",
          "Recommendations",
          "Next steps",
          "Roadmap",
        ],
      },
    },
    {
      id: "adoption-data-1",
      type: "adoption-data",
      title: "Adoption Review: Usage Signals",
      section: "adoption",
      payload: {
        metrics: firstDataSet,
        periodLabel: customer.periodLabel,
      },
    },
    {
      id: "adoption-data-2",
      type: "adoption-data",
      title: "Adoption Review: Outcomes",
      section: "adoption",
      payload: {
        metrics: secondDataSet,
        periodLabel: customer.periodLabel,
      },
    },
    {
      id: "adoption-reco-1",
      type: "adoption-recommendation",
      title: "Recommendations: Adoption Levers",
      section: "adoption",
      payload: {
        recommendations: firstRecommendations,
      },
    },
    {
      id: "adoption-reco-2",
      type: "adoption-recommendation",
      title: "Recommendations: Process Levers",
      section: "adoption",
      payload: {
        recommendations: secondRecommendations,
      },
    },
    {
      id: "next-steps",
      type: "next-steps",
      title: "Next Steps",
      section: "planning",
      payload: {
        bullets: customer.nextSteps,
      },
    },
    {
      id: "roadmap",
      type: "roadmap",
      title: "Roadmap Highlights",
      section: "planning",
      payload: {
        bullets: customer.roadmapItems,
      },
    },
  ];
}
