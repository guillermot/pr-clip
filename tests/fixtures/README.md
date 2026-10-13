# GitHub page fixtures

Minimal, sanitized reproductions of the GitHub pull request markup that
`src/lib/extract-pr.ts` depends on. They keep the real element structure and
class names but drop everything else (scripts, user data, unrelated UI).

| Fixture | Source |
| --- | --- |
| `pr-conversation.html` | React PR UI, conversation tab (captured 2026-10 from react/react#36743) |
| `pr-changes.html` | React PR UI, "Files changed" tab (`/changes`), with per-file counts below the header |
| `pr-classic.html` | Classic Rails PR UI (`#diffstat`, `bdi.js-issue-title`), still served by older GitHub Enterprise Server versions |
| `pr-loading.html` | Header rendered before the diffstat has loaded |

## When GitHub changes its markup

1. Open an affected PR, inspect the title and the `+N −M` counters in DevTools.
2. Add a new fixture that reproduces the new structure (keep it minimal, no personal data).
3. Add a test case in `tests/extract-pr.test.ts`, then adjust the selectors.
