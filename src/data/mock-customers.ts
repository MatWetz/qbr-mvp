import { CustomerData } from "@/types/qbr";

export const mockCustomers: CustomerData[] = [
  {
    id: "acme",
    name: "Acme Health",
    logoText: "AH",
    periodLabel: "Q4 2025",
    adoptionMetrics: [
      { label: "Active Repositories", current: 84, previous: 71, unit: "count" },
      { label: "PR Coverage", current: 76, previous: 63, unit: "percent" },
      { label: "Avg. Review Turnaround", current: 18, previous: 25, unit: "count" },
      { label: "Resolved Findings", current: 912, previous: 708, unit: "count" },
    ],
    recommendations: [
      {
        title: "Expand policy templates",
        detail:
          "Standardize review requirements in high-volume repos to reduce manual exceptions.",
      },
      {
        title: "Increase engineer onboarding",
        detail:
          "Run enablement sessions for two newly onboarded teams to accelerate first-month usage.",
      },
      {
        title: "Promote release readiness checks",
        detail:
          "Use pre-release quality gates on critical services for tighter production confidence.",
      },
      {
        title: "Track top finding categories",
        detail:
          "Prioritize remediation playbooks around repeated issue classes for faster closure.",
      },
    ],
    nextSteps: [
      "Align on adoption target for Q1 2026",
      "Finalize pilot for platform engineering org",
      "Review enterprise policy baseline by March",
    ],
    roadmapItems: [
      "Unified cross-repo insights dashboard",
      "Custom policy packs for regulated workloads",
      "Automated trend summaries for weekly leadership updates",
    ],
  },
  {
    id: "northstar",
    name: "Northstar Retail",
    logoText: "NR",
    periodLabel: "Q4 2025",
    adoptionMetrics: [
      { label: "Active Repositories", current: 53, previous: 45, unit: "count" },
      { label: "PR Coverage", current: 68, previous: 59, unit: "percent" },
      { label: "Avg. Review Turnaround", current: 21, previous: 29, unit: "count" },
      { label: "Resolved Findings", current: 641, previous: 501, unit: "count" },
    ],
    recommendations: [
      {
        title: "Consolidate quality standards",
        detail:
          "Roll out shared coding quality baseline across storefront, checkout, and fulfillment repos.",
      },
      {
        title: "Prioritize high-risk services",
        detail:
          "Adopt stricter review thresholds for payment and inventory services before holiday ramp.",
      },
      {
        title: "Build team scorecards",
        detail:
          "Publish monthly adoption scorecards for engineering managers to drive accountability.",
      },
      {
        title: "Improve closure workflows",
        detail:
          "Create response playbooks for recurring findings to cut mean time to resolution.",
      },
    ],
    nextSteps: [
      "Confirm FY26 success metrics with CTO staff",
      "Schedule enablement office hours for checkout team",
      "Review dashboard access model with security",
    ],
    roadmapItems: [
      "Role-based executive views for QBR prep",
      "Automated recommendation generation by team",
      "Integrations with engineering planning tools",
    ],
  },
];
