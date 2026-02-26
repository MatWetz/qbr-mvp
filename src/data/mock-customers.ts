import { AdoptionMetric, CustomerData } from "@/types/qbr";
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

function activeRepositoriesMetric(
  current: UsageCsvRow[],
  previous: UsageCsvRow[],
): AdoptionMetric {
  return {
    label: "Active Repositories",
    current: uniqueRepositoryCount(current),
    previous: uniqueRepositoryCount(previous),
    unit: "count",
  };
}

function activeAuthorsMetric(current: UsageCsvRow[], previous: UsageCsvRow[]): AdoptionMetric {
  return {
    label: "Active Authors",
    current: uniqueAuthorCount(current),
    previous: uniqueAuthorCount(previous),
    unit: "count",
  };
}

function usageMetrics(current: UsageCsvRow[], previous: UsageCsvRow[]) {
  return [
    activeRepositoriesMetric(current, previous),
    activeAuthorsMetric(current, previous),
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
  ];
}

function usageOutcomeMetrics(current: UsageCsvRow[], previous: UsageCsvRow[]) {
  return [
    activeRepositoriesMetric(current, previous),
    activeAuthorsMetric(current, previous),
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
  const majorCriticalAccepted = majorAndCriticalAccepted(current);
  const majorCriticalRate = majorCriticalAcceptanceRate(current);

  return [
    {
      title: "Capture Learnings in Inline Review Replies",
      detail:
        "Reply to specific CodeRabbit comments with @coderabbitai so preferences are stored with exact code context, not as generic PR notes.",
    },
    {
      title: "Separate Path Instructions from Guidelines",
      detail:
        "Use path_instructions to tell CodeRabbit how to review matched files, and keep CLAUDE.md/.cursorrules as Code Guidelines references.",
    },
    {
      title: "Apply Targeted Review Strictness by Directory",
      detail:
        "Add path-based instructions for high-risk areas (auth, payments, infra) so review depth matches business-critical code paths.",
    },
    {
      title: "Review Learnings Quarterly",
      detail: `${majorCriticalAccepted} high-severity findings were accepted at a ${majorCriticalRate}% high-severity acceptance rate. Run quarterly cleanup to remove stale or conflicting learnings.`,
    },
  ];
}

function buildCustomer(
  id: string,
  name: string,
  logoText: string,
  metricProfile: MetricProfile,
  nextSteps: CustomerData["nextSteps"],
  roadmapItems: CustomerData["roadmapItems"],
): CustomerData {
  const rows = mockUsageEvents.filter((event) => event.organization_name === name);
  const quarterLabels = Array.from(new Set(rows.map((row) => toQuarterLabel(row.created_at)))).sort(
    (a, b) => {
      // "Q3 2025" → year=2025, q=3
      const [aq, ay] = [parseInt(a[1]), parseInt(a.slice(3))];
      const [bq, by] = [parseInt(b[1]), parseInt(b.slice(3))];
      return ay !== by ? ay - by : aq - bq;
    },
  );
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
      {
        headline: "Align review-lag targets by repository",
        detail:
          "Set Q1 2026 first-review lag goals for the three highest-volume repositories. Track weekly variance and escalate blockers in platform sync.",
      },
      {
        headline: "Operationalize acceptance-rate KPI tracking",
        detail:
          "Add acceptance-rate thresholds to the engineering leadership scorecard. Trigger follow-up when any core team drops below target for two consecutive weeks.",
      },
      {
        headline: "Standardize major-finding remediation",
        detail:
          "Finalize a remediation playbook that defines owner assignment, SLA windows, and verification criteria for major and critical findings.",
      },
      {
        headline: "Expand reviewer enablement in high-risk areas",
        detail:
          "Run focused training for auth and payments reviewers on interpreting CodeRabbit severity and suggested fixes. Measure impact through accepted high-severity comments.",
      },
    ],
    [
      {
        headline: "Multi-Repo Analysis for dependency-aware reviews",
        detail:
          "Enable cross-repository analysis to surface API and dependency impact during code review. This reduces blind spots when changes span shared services.",
      },
      {
        headline: "Issue Planner for actionable implementation plans",
        detail:
          "Convert issue context into stepwise delivery plans with clear sequencing and ownership. Use generated plans to accelerate kickoff for complex workstreams.",
      },
      {
        headline: "Review Metrics API and Data Export",
        detail:
          "Provide PR-level quality and velocity telemetry through API and export workflows. This unlocks dashboarding in existing engineering analytics systems.",
      },
      {
        headline: "Finishing touch recipes for reusable automations",
        detail:
          "Package repeatable finishing-touch workflows so teams can apply consistent PR improvements automatically. Start with recipes for docs, tests, and cleanup passes.",
      },
    ],
  ),
  buildCustomer(
    "northstar",
    "Northstar Retail",
    "NR",
    "outcome",
    [
      {
        headline: "Lock FY26 quality KPI targets",
        detail:
          "Finalize KPI thresholds with platform leadership and publish them by team. Tie targets to quarterly planning checkpoints and review cadence.",
      },
      {
        headline: "Roll out review ownership rotations",
        detail:
          "Introduce rotating review captains for checkout and inventory repositories. Use the rotation to improve coverage and reduce review bottlenecks.",
      },
      {
        headline: "Define escalation for unresolved major findings",
        detail:
          "Create a clear escalation path when major comments remain unaddressed past SLA. Include duty owner handoff and leadership visibility triggers.",
      },
      {
        headline: "Harden severity-based triage norms",
        detail:
          "Standardize triage playbooks that separate critical, major, and low-risk findings. This keeps response urgency consistent across teams and shifts.",
      },
    ],
    [
      {
        headline: "Custom finishing touch recipes (early access)",
        detail:
          "Author reusable finishing-touch recipes tailored to Northstar coding patterns. Early access enables faster iteration before broad rollout.",
      },
      {
        headline: "Auto-pause after reviewed commits",
        detail:
          "Pause additional review churn after commits already reviewed to keep signal high. This helps teams focus on net-new changes at scale.",
      },
      {
        headline: "Expanded tool coverage across security and quality",
        detail:
          "Add support for Stylelint, TruffleHog, OpenGrep, TFLint, and Trivy within the review pipeline. Broader coverage catches policy and security drift earlier.",
      },
      {
        headline: "Cross-team quality benchmarking dashboards",
        detail:
          "Expose comparable review and acceptance benchmarks across product teams. Use shared baselines to prioritize enablement where impact is highest.",
      },
    ],
  ),
];
