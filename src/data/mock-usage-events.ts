export interface UsageCsvRow {
  pr_url: string;
  author_id: number;
  author_username: string;
  organization_id: number;
  organization_name: string;
  repository_id: number;
  repository_name: string;
  created_at: string;
  first_human_review_at: string;
  last_commit_at: string;
  merged_at: string;
  estimated_complexity: number;
  estimated_review_minutes: number;
  total_coderabbit_comments_posted: number;
  total_coderabbit_comments_accepted: number;
  data_integrity_and_integration_comments_posted: number;
  data_integrity_and_integration_comments_accepted: number;
  functional_correctness_comments_posted: number;
  functional_correctness_comments_accepted: number;
  maintainability_and_code_quality_comments_posted: number;
  maintainability_and_code_quality_comments_accepted: number;
  performance_and_scalability_comments_posted: number;
  performance_and_scalability_comments_accepted: number;
  security_and_privacy_comments_posted: number;
  security_and_privacy_comments_accepted: number;
  stability_and_availability_comments_posted: number;
  stability_and_availability_comments_accepted: number;
  critical_comments_posted: number;
  critical_comments_accepted: number;
  major_comments_posted: number;
  major_comments_accepted: number;
  minor_comments_posted: number;
  minor_comments_accepted: number;
  trivial_comments_posted: number;
  trivial_comments_accepted: number;
  info_comments_posted: number;
  info_comments_accepted: number;
}

function row(seed: {
  orgId: number;
  org: string;
  repoId: number;
  repo: string;
  pr: number;
  author: string;
  authorId: number;
  createdAt: string;
  firstReviewAt: string;
  lastCommitAt: string;
  mergedAt: string;
  complexity: number;
  reviewMinutes: number;
  posted: number;
  accepted: number;
  majorPosted: number;
  majorAccepted: number;
  minorPosted: number;
  minorAccepted: number;
  trivialPosted: number;
  trivialAccepted: number;
}): UsageCsvRow {
  return {
    pr_url: `https://github.com/${seed.author}/qbr-mvp/pull/${seed.pr}`,
    author_id: seed.authorId,
    author_username: seed.author,
    organization_id: seed.orgId,
    organization_name: seed.org,
    repository_id: seed.repoId,
    repository_name: seed.repo,
    created_at: seed.createdAt,
    first_human_review_at: seed.firstReviewAt,
    last_commit_at: seed.lastCommitAt,
    merged_at: seed.mergedAt,
    estimated_complexity: seed.complexity,
    estimated_review_minutes: seed.reviewMinutes,
    total_coderabbit_comments_posted: seed.posted,
    total_coderabbit_comments_accepted: seed.accepted,
    data_integrity_and_integration_comments_posted: 1,
    data_integrity_and_integration_comments_accepted: 1,
    functional_correctness_comments_posted: Math.max(1, Math.floor(seed.posted / 4)),
    functional_correctness_comments_accepted: Math.max(1, Math.floor(seed.accepted / 4)),
    maintainability_and_code_quality_comments_posted: Math.max(2, Math.floor(seed.posted / 2)),
    maintainability_and_code_quality_comments_accepted: Math.max(1, Math.floor(seed.accepted / 2)),
    performance_and_scalability_comments_posted: 1,
    performance_and_scalability_comments_accepted: 1,
    security_and_privacy_comments_posted: 1,
    security_and_privacy_comments_accepted: 0,
    stability_and_availability_comments_posted: 1,
    stability_and_availability_comments_accepted: 1,
    critical_comments_posted: 0,
    critical_comments_accepted: 0,
    major_comments_posted: seed.majorPosted,
    major_comments_accepted: seed.majorAccepted,
    minor_comments_posted: seed.minorPosted,
    minor_comments_accepted: seed.minorAccepted,
    trivial_comments_posted: seed.trivialPosted,
    trivial_comments_accepted: seed.trivialAccepted,
    info_comments_posted: Math.max(0, seed.posted - seed.majorPosted - seed.minorPosted - seed.trivialPosted),
    info_comments_accepted: Math.max(
      0,
      seed.accepted - seed.majorAccepted - seed.minorAccepted - seed.trivialAccepted,
    ),
  };
}

export const mockUsageEvents: UsageCsvRow[] = [
  row({
    orgId: 1001,
    org: "Acme Health",
    repoId: 20001,
    repo: "ehr-core",
    pr: 101,
    author: "acme-dev-1",
    authorId: 3101,
    createdAt: "2025-08-06T14:10:00.000Z",
    firstReviewAt: "2025-08-06T15:02:00.000Z",
    lastCommitAt: "2025-08-06T16:12:00.000Z",
    mergedAt: "2025-08-06T17:01:00.000Z",
    complexity: 4,
    reviewMinutes: 44,
    posted: 16,
    accepted: 11,
    majorPosted: 3,
    majorAccepted: 2,
    minorPosted: 7,
    minorAccepted: 5,
    trivialPosted: 3,
    trivialAccepted: 2,
  }),
  row({
    orgId: 1001,
    org: "Acme Health",
    repoId: 20002,
    repo: "patient-portal",
    pr: 102,
    author: "acme-dev-2",
    authorId: 3102,
    createdAt: "2025-09-03T12:00:00.000Z",
    firstReviewAt: "2025-09-03T12:48:00.000Z",
    lastCommitAt: "2025-09-03T13:36:00.000Z",
    mergedAt: "2025-09-03T14:08:00.000Z",
    complexity: 3,
    reviewMinutes: 39,
    posted: 14,
    accepted: 10,
    majorPosted: 2,
    majorAccepted: 1,
    minorPosted: 6,
    minorAccepted: 5,
    trivialPosted: 4,
    trivialAccepted: 3,
  }),
  row({
    orgId: 1001,
    org: "Acme Health",
    repoId: 20003,
    repo: "billing-api",
    pr: 103,
    author: "acme-dev-3",
    authorId: 3103,
    createdAt: "2025-10-09T10:30:00.000Z",
    firstReviewAt: "2025-10-09T10:56:00.000Z",
    lastCommitAt: "2025-10-09T11:24:00.000Z",
    mergedAt: "2025-10-09T11:59:00.000Z",
    complexity: 3,
    reviewMinutes: 31,
    posted: 13,
    accepted: 11,
    majorPosted: 2,
    majorAccepted: 2,
    minorPosted: 6,
    minorAccepted: 5,
    trivialPosted: 3,
    trivialAccepted: 2,
  }),
  row({
    orgId: 1001,
    org: "Acme Health",
    repoId: 20001,
    repo: "ehr-core",
    pr: 104,
    author: "acme-dev-1",
    authorId: 3101,
    createdAt: "2025-11-12T09:45:00.000Z",
    firstReviewAt: "2025-11-12T10:08:00.000Z",
    lastCommitAt: "2025-11-12T10:44:00.000Z",
    mergedAt: "2025-11-12T11:02:00.000Z",
    complexity: 2,
    reviewMinutes: 29,
    posted: 12,
    accepted: 10,
    majorPosted: 1,
    majorAccepted: 1,
    minorPosted: 5,
    minorAccepted: 4,
    trivialPosted: 3,
    trivialAccepted: 3,
  }),
  row({
    orgId: 1001,
    org: "Acme Health",
    repoId: 20002,
    repo: "patient-portal",
    pr: 105,
    author: "acme-dev-4",
    authorId: 3104,
    createdAt: "2025-12-03T13:20:00.000Z",
    firstReviewAt: "2025-12-03T13:41:00.000Z",
    lastCommitAt: "2025-12-03T14:06:00.000Z",
    mergedAt: "2025-12-03T14:29:00.000Z",
    complexity: 2,
    reviewMinutes: 27,
    posted: 11,
    accepted: 10,
    majorPosted: 1,
    majorAccepted: 1,
    minorPosted: 4,
    minorAccepted: 4,
    trivialPosted: 3,
    trivialAccepted: 3,
  }),
  row({
    orgId: 1002,
    org: "Northstar Retail",
    repoId: 21001,
    repo: "checkout-service",
    pr: 201,
    author: "northstar-dev-1",
    authorId: 3201,
    createdAt: "2025-07-18T16:05:00.000Z",
    firstReviewAt: "2025-07-18T17:12:00.000Z",
    lastCommitAt: "2025-07-18T18:20:00.000Z",
    mergedAt: "2025-07-18T19:01:00.000Z",
    complexity: 4,
    reviewMinutes: 52,
    posted: 18,
    accepted: 10,
    majorPosted: 4,
    majorAccepted: 2,
    minorPosted: 8,
    minorAccepted: 5,
    trivialPosted: 3,
    trivialAccepted: 1,
  }),
  row({
    orgId: 1002,
    org: "Northstar Retail",
    repoId: 21002,
    repo: "inventory-core",
    pr: 202,
    author: "northstar-dev-2",
    authorId: 3202,
    createdAt: "2025-09-22T11:50:00.000Z",
    firstReviewAt: "2025-09-22T12:43:00.000Z",
    lastCommitAt: "2025-09-22T13:28:00.000Z",
    mergedAt: "2025-09-22T14:09:00.000Z",
    complexity: 3,
    reviewMinutes: 47,
    posted: 15,
    accepted: 9,
    majorPosted: 3,
    majorAccepted: 2,
    minorPosted: 6,
    minorAccepted: 4,
    trivialPosted: 3,
    trivialAccepted: 2,
  }),
  row({
    orgId: 1002,
    org: "Northstar Retail",
    repoId: 21003,
    repo: "fulfillment-ui",
    pr: 203,
    author: "northstar-dev-3",
    authorId: 3203,
    createdAt: "2025-10-15T09:30:00.000Z",
    firstReviewAt: "2025-10-15T10:10:00.000Z",
    lastCommitAt: "2025-10-15T10:54:00.000Z",
    mergedAt: "2025-10-15T11:33:00.000Z",
    complexity: 3,
    reviewMinutes: 40,
    posted: 14,
    accepted: 10,
    majorPosted: 2,
    majorAccepted: 1,
    minorPosted: 6,
    minorAccepted: 5,
    trivialPosted: 3,
    trivialAccepted: 2,
  }),
  row({
    orgId: 1002,
    org: "Northstar Retail",
    repoId: 21001,
    repo: "checkout-service",
    pr: 204,
    author: "northstar-dev-1",
    authorId: 3201,
    createdAt: "2025-11-05T15:15:00.000Z",
    firstReviewAt: "2025-11-05T15:46:00.000Z",
    lastCommitAt: "2025-11-05T16:18:00.000Z",
    mergedAt: "2025-11-05T16:47:00.000Z",
    complexity: 2,
    reviewMinutes: 34,
    posted: 13,
    accepted: 10,
    majorPosted: 2,
    majorAccepted: 2,
    minorPosted: 5,
    minorAccepted: 4,
    trivialPosted: 3,
    trivialAccepted: 2,
  }),
  row({
    orgId: 1002,
    org: "Northstar Retail",
    repoId: 21002,
    repo: "inventory-core",
    pr: 205,
    author: "northstar-dev-4",
    authorId: 3204,
    createdAt: "2025-12-18T10:05:00.000Z",
    firstReviewAt: "2025-12-18T10:31:00.000Z",
    lastCommitAt: "2025-12-18T11:09:00.000Z",
    mergedAt: "2025-12-18T11:41:00.000Z",
    complexity: 2,
    reviewMinutes: 30,
    posted: 12,
    accepted: 10,
    majorPosted: 1,
    majorAccepted: 1,
    minorPosted: 5,
    minorAccepted: 4,
    trivialPosted: 3,
    trivialAccepted: 3,
  }),
];
