# PR Clip privacy policy

_Last updated: 2026-10-13_

PR Clip is a browser extension that copies a summary of a GitHub pull request to your clipboard. It is built to collect nothing.

## What PR Clip accesses

- **The current tab, only when you click the icon or press the shortcut.** It reads the pull request's title and line counts from the page. Nothing is read in the background or from other tabs.
- **Your clipboard (write only).** It writes the formatted message. It never reads your clipboard.

## What PR Clip stores

- **Your message template**, in Chrome's sync storage, so it follows your Chrome profile across devices.
- **An optional GitHub token**, only if you add one, in Chrome's local storage on your device. It is never synced.

You can remove both at any time from the options page, or by uninstalling the extension.

## Network requests

When the page doesn't expose the pull request details, PR Clip requests them from the GitHub REST API (`api.github.com`), with your token if you saved one. GitHub's [privacy statement](https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement) applies to those requests. PR Clip makes no other network requests.

## What PR Clip does not do

- No analytics, tracking, advertising, or telemetry.
- No servers of its own; no data is sent to the developer.
- No selling or sharing of data with anyone.

## Contact

Open an issue at https://github.com/guillermot/pr-clip/issues, or report security concerns privately as described in [SECURITY.md](https://github.com/guillermot/pr-clip/blob/main/SECURITY.md).
