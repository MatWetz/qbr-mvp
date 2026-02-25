import { CustomerData } from "@/types/qbr";
import { mockUsageEvents, UsageCsvRow } from "@/data/mock-usage-events";

/**
 * Convert an ISO date string to a quarter label (e.g., "Q1 2025").
 *
 * @param isoDate - An ISO 8601 date string (UTC is used for month/year extraction)
 * @returns The quarter label in the format `Q{quarter} {year}`
 */
function toQuarterLabel(isoDate: string): string {
  const date = new Date(isoDate);
  const quarter = Math.floor(date.getUTCMonth() / 3) + 1;
  return `Q${quarter} ${date.getUTCFullYear()}`;
}

/**
 * Calculates the average time in minutes from PR creation to the first human review for the provided usage rows.
 *
 * @param rows - Array of usage rows; each row must include `created_at` and `first_human_review_at` timestamp fields.
 * @returns `0` if `rows` is empty; otherwise the rounded average number of minutes between `created_at` and `first_human_review_at`, treating any negative intervals as `0`.
 */
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

/**
 * Calculates the percentage of CodeRabbit comments that were accepted in the provided rows.
 *
 * @param rows - Usage CSV rows to aggregate across
 * @returns The acceptance rate as an integer percentage (0–100); returns 0 if no comments were posted
 */
function acceptedRate(rows: UsageCsvRow[]): number {
  const posted = rows.reduce((sum, row) => sum + row.total_coderabbit_comments_posted, 0);
  const accepted = rows.reduce((sum, row) => sum + row.total_coderabbit_comments_accepted, 0);
  if (!posted) {
    return 0;
  }
  return Math.round((accepted / posted) * 100);
}

/**
 * Compute the count of distinct repositories referenced in the given usage rows.
 *
 * @param rows - Rows to inspect for repository names
 * @returns The number of distinct `repository_name` values found in `rows`
 */
function uniqueRepositoryCount(rows: UsageCsvRow[]): number {
  return new Set(rows.map((row) => row.repository_name)).size;
}

/**
 * Count unique authors represented in the provided usage rows.
 *
 * @param rows - Array of usage rows to analyze
 * @returns The count of distinct `author_username` values present in `rows`
 */
function uniqueAuthorCount(rows: UsageCsvRow[]): number {
  return new Set(rows.map((row) => row.author_username)).size;
}

/**
 * Computes the average estimated complexity across the provided usage rows.
 *
 * @param rows - Array of usage CSV rows containing `estimated_complexity` values
 * @returns The rounded average of `estimated_complexity` across `rows`; `0` if `rows` is empty
 */
function avgEstimatedComplexity(rows: UsageCsvRow[]): number {
  if (!rows.length) {
    return 0;
  }

  const total = rows.reduce((sum, row) => sum + row.estimated_complexity, 0);
  return Math.round(total / rows.length);
}

/**
 * Compute the average number of CodeRabbit comments posted per pull request.
 *
 * @param rows - Array of usage rows representing reviewed pull requests
 * @returns The average comments posted per PR, rounded to the nearest integer (0 if `rows` is empty)
 */
function avgCommentsPerPr(rows: UsageCsvRow[]): number {
  if (!rows.length) {
    return 0;
  }

  const posted = rows.reduce((sum, row) => sum + row.total_coderabbit_comments_posted, 0);
  return Math.round(posted / rows.length);
}

/**
 * Computes the average lead time in minutes from PR creation to merge.
 *
 * Computes the average of (merged_at - created_at) in minutes across the provided rows, treating any negative durations as zero. If `rows` is empty, returns `0`.
 *
 * @param rows - Array of usage rows; each row must include `created_at` and `merged_at` timestamps
 * @returns The rounded average lead time in minutes across `rows`, or `0` if `rows` is empty
 */
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

/**
 * Computes the acceptance rate for major and critical comments.
 *
 * @param rows - Array of usage rows whose major/critical comment counts will be aggregated
 * @returns The acceptance rate as a whole-number percentage (0–100) of accepted major+critical comments over posted major+critical comments; returns 0 if no posted comments
 */
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

/**
 * Compute the total number of accepted CodeRabbit comments across the provided rows.
 *
 * @param rows - The usage rows to aggregate accepted comment counts from
 * @returns The sum of `total_coderabbit_comments_accepted` across `rows`
 */
function acceptedTotal(rows: UsageCsvRow[]): number {
  return rows.reduce((sum, row) => sum + row.total_coderabbit_comments_accepted, 0);
}

/**
 * Compute the total accepted major and critical comments across the provided usage rows.
 *
 * @param rows - Array of usage rows to aggregate
 * @returns The sum of `major_comments_accepted` and `critical_comments_accepted` across all `rows`
 */
function majorAndCriticalAccepted(rows: UsageCsvRow[]): number {
  return rows.reduce(
    (sum, row) => sum + row.major_comments_accepted + row.critical_comments_accepted,
    0,
  );
}

/**
 * Builds a set of comparison metrics for two periods from usage CSV rows.
 *
 * @param current - Usage rows belonging to the current period
 * @param previous - Usage rows belonging to the previous period
 * @returns An array of metric records; each record has `label`, numeric `current` and `previous` values, and a `unit` string (`"count"`, `"percent"`, or `"minutes"`)
 */
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

/**
 * Builds outcome-focused usage metrics comparing two periods.
 *
 * @param current - Usage rows for the current period
 * @param previous - Usage rows for the previous period
 * @returns An array of metric records, each containing `label` (metric name), `current` (numeric value for the current period), `previous` (numeric value for the previous period), and `unit` (one of `"count"`, `"percent"`, or `"minutes"`)
 */
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

/**
 * Generate recommendations based on usage rows for the current period.
 *
 * @param current - Usage data rows representing the current period
 * @returns An array of recommendation objects with `title` and `detail` describing suggested actions and supporting metrics (e.g., acceptance rate and accepted counts)
 */
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

/**
 * Construct a CustomerData record for the given organization by aggregating mock usage events and selecting a metrics profile.
 *
 * @param id - Unique identifier for the customer record
 * @param name - Organization name used to filter usage events
 * @param logoText - Short text to display for the customer's logo
 * @param metricProfile - Metric profile to use: `"full"` returns the full set of adoption metrics, `"outcome"` returns the outcome-focused metrics
 * @param nextSteps - Ordered list of next-step strings to include in the customer record
 * @param roadmapItems - Ordered list of roadmap-item strings to include in the customer record
 * @returns CustomerData with periodLabel set to the latest quarter from the organization's events, adoptionMetrics computed for current and previous quarters according to the selected profile, recommendations derived from current-quarter events, and the provided nextSteps and roadmapItems
 */
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
