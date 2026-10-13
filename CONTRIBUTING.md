# Contributing to PR Clip

Thanks for helping! This guide covers local setup, the project layout, and how we work.

## Setup

Requirements: Node.js 24 (see `.nvmrc`) and pnpm (the version is pinned in `package.json`).

```sh
pnpm install
pnpm dev        # opens Chrome with the extension loaded and hot reload
```

## Scripts

| Command          | What it does                                      |
| ---------------- | ------------------------------------------------- |
| `pnpm dev`       | Development build with hot reload                 |
| `pnpm build`     | Production build in `.output/chrome-mv3`          |
| `pnpm zip`       | Store-ready zip in `.output/`                     |
| `pnpm test`      | Unit tests (Vitest)                               |
| `pnpm typecheck` | TypeScript                                        |
| `pnpm lint`      | ESLint                                            |
| `pnpm format`    | Prettier (a pre-commit hook formats staged files) |

## Project layout

```
src/
  entrypoints/
    background.ts     # icon click / shortcut → copy flow
    offscreen/        # writes to the clipboard
    options/          # options page
  lib/
    copy-pr.ts        # the copy flow, with injectable dependencies
    extract-pr.ts     # reads title + diffstat from the GitHub page
    github-api.ts     # REST fallback
    template.ts       # {placeholder} rendering
    pr-url.ts, settings.ts, i18n.ts, badge.ts, clipboard.ts
public/_locales/      # translations (en is the source of truth)
tests/                # Vitest + HTML fixtures of GitHub pages
```

## When GitHub changes its markup

This is the most likely reason PR Clip breaks. To fix it:

1. Open an affected PR and inspect the title and the `+N −M` counters.
2. Add a minimal fixture to `tests/fixtures/` that reproduces the new structure (see its README).
3. Add a failing test in `tests/extract-pr.test.ts`, then update the selectors in `src/lib/extract-pr.ts`.

`extractPr` is injected into the page with `chrome.scripting.executeScript`, so it must stay self-contained, with no imports and no outer variables. A test checks this.

## Translations

Add `public/_locales/<locale>/messages.json` with the same keys as `en`. The tests check that keys and placeholders match.

## Pull requests

- Branch from `main`; one focused change per PR.
- Use [Conventional Commits](https://www.conventionalcommits.org/) for PR titles (`feat: …`, `fix: …`, `docs: …`). PRs are squash-merged, and the titles become the changelog.
- CI must pass: typecheck, lint, format, tests, and build.
- For UI changes, include a screenshot.

By participating you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Releases

Releases are automated with [release-please](https://github.com/googleapis/release-please):

1. Every merge to `main` updates a **release PR** that bumps the version in `package.json`, which WXT copies into the manifest, and updates `CHANGELOG.md`.
2. Merging the release PR tags the version, creates a GitHub Release, and attaches the store-ready zip.

`feat` bumps the minor version, `fix` bumps the patch version, and `feat!`/`BREAKING CHANGE` bumps the major version. The first release is `1.0.0`.
