/** Identifies a pull request on github.com. */
export interface PrRef {
  owner: string;
  repo: string;
  number: number;
}

/** Details read from the PR page or the GitHub API. */
export interface PrDetails {
  title: string;
  additions: number;
  deletions: number;
}

export type PrData = PrRef & PrDetails;
