import { CustomerData } from "@/types/qbr";
import { mockUsageEvents, UsageCsvRow } from "@/data/mock-usage-events";

function toQuarterLabel(isoDate: string): string {
  const date = new Date(isoDate);
  const quarter = Math.floor(date.getUTCMonth() / 3) + 1;
  return `Q${quarter} ${date.getUTCFullYear()}`;
}

function avgReviewLagMinutes(rows: UsageCsvRow[]): number {
  if (!rows.length) {
    return 0;
  }

  const totalMinutes = rows.reduce((sum, row) => {
    const createdAt = new Date(row.created_at).getTime();
    const firstReviewAt = new Date(row.first_human_review_at).getTime();
    return sum + Math.max(0, (firstReviewAt - createdAt) / (1000 * 60));
  }, 0);

  return Math.round(totalMinutes / rows.length);
}

function acceptedRate(rows: UsageCsvRow[]): number {
  const posted = rows.reduce((sum, row) => sum + row.total_coderabbit_comments_posted, 0);
  const accepted = rows.reduce((sum, row) => sum + row.total_coderabbit_comments_accepted, 0);
  if (!posted) {
    return 0;
  }
  return Math.round((accepted / posted) * 100);
}

function uniqueRepositoryCount(rows: UsageCsvRow[]): number {
  return new Set(rows.map((row) => row.repository_name)).size;
}

function uniqueAuthorCount(rows: UsageCsvRow[]): number {
  return new Set(rows.map((row) => row.author_username)).size;
}

function avgEstimatedComplexity(rows: UsageCsvRow[]): number {
  if (!rows.length) {
    return 0;
  }

  const total = rows.reduce((sum, row) => sum + row.estimated_complexity, 0);
  return Math.round(total / rows.length);
}

function avgCommentsPerPr(rows: UsageCsvRow[]): number {
  if (!rows.length) {
    return 0;
  }

  const posted = rows.reduce((sum, row) => sum + row.total_coderabbit_comments_posted, 0);
  return Math.round(posted / rows.length);
}

function avgMergeLeadMinutes(rows: UsageCsvRow[]): number {
  if (!rows.length) {
    return 0;
  }

  const totalMinutes = rows.reduce((sum, row) => {
    const createdAt = new Date(row.created_at).getTime();
    const mergedAt = new Date(row.merged_at).getTime();
    return sum + Math.max(0, (mergedAt - createdAt) / (1000 * 60));
  }, 0);

  return Math.round(totalMinutes / rows.length);
}

function majorCriticalAcceptanceRate(rows: UsageCsvRow[]): number {
  const posted = rows.reduce(
    (sum, row) => sum + row.major_comments_posted + row.critical_comments_posted,
    0,
  );
  const accepted = rows.reduce(
    (sum, row) => sum + row.major_comments_accepted + row.critical_comments_accepted,
    0,
  );

  if (!posted) {
    return 0;
  }

  return Math.round((accepted / posted) * 100);
}

function acceptedTotal(rows: UsageCsvRow[]): number {
  return rows.reduce((sum, row) => sum + row.total_coderabbit_comments_accepted, 0);
}

function majorAndCriticalAccepted(rows: UsageCsvRow[]): number {
  return rows.reduce(
    (sum, row) => sum + row.major_comments_accepted + row.critical_comments_accepted,
    0,
  );
}

function usageMetrics(current: UsageCsvRow[], previous: UsageCsvRow[]) {
  return [
    {
      label: "Active Repositories",
      current: uniqueRepositoryCount(current),
      previous: uniqueRepositoryCount(previous),
      unit: "count" as const,
    },
    {
      label: "Active Authors",
      current: uniqueAuthorCount(current),
      previous: uniqueAuthorCount(previous),
      unit: "count" as const,
    },
    {
      label: "Reviewed PRs",
      current: current.length,
      previous: previous.length,
      unit: "count" as const,
    },
    {
      label: "Comment Acceptance Rate",
      current: acceptedRate(current),
      previous: acceptedRate(previous),
      unit: "percent" as const,
    },
    {
      label: "Major/Critical Acceptance",
      current: majorCriticalAcceptanceRate(current),
      previous: majorCriticalAcceptanceRate(previous),
      unit: "percent" as const,
    },
    {
      label: "Avg. Complexity",
      current: avgEstimatedComplexity(current),
      previous: avgEstimatedComplexity(previous),
      unit: "count" as const,
    },
    {
      label: "Avg. First Review Lag",
      current: avgReviewLagMinutes(current),
      previous: avgReviewLagMinutes(previous),
      unit: "minutes" as const,
    },
    {
      label: "Avg. Comments per PR",
      current: avgCommentsPerPr(current),
      previous: avgCommentsPerPr(previous),
      unit: "count" as const,
    },
    {
      label: "Accepted Findings",
      current: acceptedTotal(current),
      previous: acceptedTotal(previous),
      unit: "count" as const,
    },
  ];
}

function usageOutcomeMetrics(current: UsageCsvRow[], previous: UsageCsvRow[]) {
  return [
    {
      label: "Reviewed PRs",
      current: current.length,
      previous: previous.length,
      unit: "count" as const,
    },
    {
      label: "Comment Acceptance Rate",
      current: acceptedRate(current),
      previous: acceptedRate(previous),
      unit: "percent" as const,
    },
    {
      label: "Major/Critical Acceptance",
      current: majorCriticalAcceptanceRate(current),
      previous: majorCriticalAcceptanceRate(previous),
      unit: "percent" as const,
    },
    {
      label: "Accepted Findings",
      current: acceptedTotal(current),
      previous: acceptedTotal(previous),
      unit: "count" as const,
    },
    {
      label: "Avg. First Review Lag",
      current: avgReviewLagMinutes(current),
      previous: avgReviewLagMinutes(previous),
      unit: "minutes" as const,
    },
    {
      label: "Avg. Merge Lead Time",
      current: avgMergeLeadMinutes(current),
      previous: avgMergeLeadMinutes(previous),
      unit: "minutes" as const,
    },
  ];
}

type MetricProfile = "full" | "outcome";

function usageRecommendations(current: UsageCsvRow[]): CustomerData["recommendations"] {
  const posted = current.reduce((sum, row) => sum + row.total_coderabbit_comments_posted, 0);
  const accepted = acceptedTotal(current);
  const majorCriticalAccepted = majorAndCriticalAccepted(current);

  const acceptanceRate = posted ? Math.round((accepted / posted) * 100) : 0;

  return [
    {
      title: "Improve finding acceptance consistency",
      detail: `Current acceptance is ${acceptanceRate}%. Target 80%+ by tightening reviewer ownership and SLA follow-up.`,
    },
    {
      title: "Prioritize higher-severity closure",
      detail: `${majorCriticalAccepted} major/critical comments were accepted this period. Add weekly triage for unresolved high-impact findings.`,
    },
    {
      title: "Reduce first review lag in core repos",
      detail: "Set repo-level review rotations for top-volume services to cut time-to-first-review.",
    },
    {
      title: "Promote repeatable remediation",
      detail: "Convert frequently accepted findings into coding standards and PR checklist rules.",
    },
  ];
}

function buildCustomer(
  id: string,
  name: string,
  logoText: string,
  metricProfile: MetricProfile,
  nextSteps: string[],
  roadmapItems: string[],
): CustomerData {
  const rows = mockUsageEvents.filter((event) => event.organization_name === name);
  const quarterLabels = Array.from(new Set(rows.map((row) => toQuarterLabel(row.created_at)))).sort();
  const currentQuarter = quarterLabels[quarterLabels.length - 1];
  const previousQuarter = quarterLabels[quarterLabels.length - 2] ?? currentQuarter;

  const currentRows = rows.filter((row) => toQuarterLabel(row.created_at) === currentQuarter);
  const previousRows = rows.filter((row) => toQuarterLabel(row.created_at) === previousQuarter);

  return {
    id,
    name,
    logoText,
    periodLabel: currentQuarter,
    adoptionMetrics:
      metricProfile === "outcome"
        ? usageOutcomeMetrics(currentRows, previousRows)
        : usageMetrics(currentRows, previousRows),
    recommendations: usageRecommendations(currentRows),
    nextSteps,
    roadmapItems,
  };
}

export const mockCustomers: CustomerData[] = [
  buildCustomer(
    "acme",
    "Acme Health",
    "AH",
    "full",
    [
      "Align Q1 2026 review-lag target for top 3 repositories",
      "Add acceptance-rate KPI to weekly eng leadership review",
      "Finalize remediation playbook for major findings",
    ],
    [
      "Repository-level SLA tracking for first human review",
      "Automated severity trend digest for customer success",
      "Cross-team benchmark view for acceptance performance",
    ],
  ),
  buildCustomer(
    "northstar",
    "Northstar Retail",
    "NR",
    "outcome",
    [
      "Confirm FY26 quality KPI targets with platform leadership",
      "Roll out review ownership rotations for checkout and inventory repos",
      "Define escalation workflow for unaddressed major comments",
    ],
    [
      "Dynamic repository scorecards for QBR prep",
      "Auto-generated recommendations by severity trend",
      "Planning integrations for quarterly quality objectives",
    ],
  ),
];
