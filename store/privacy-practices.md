# Privacy practices (Developer Dashboard)

Copy these answers into the **Privacy practices** tab.

## Single purpose

> Copy a formatted, shareable summary (title, link and line counts) of the GitHub pull request open in the current tab to the clipboard.

## Permission justifications

| Permission       | Justification                                                                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `activeTab`      | When the user clicks the toolbar icon or presses the shortcut, read the pull request title and line counts from that tab. No access otherwise. |
| `scripting`      | Inject a single read-only function into the active GitHub tab (after the user's click) to read the title and line counts.                      |
| `clipboardWrite` | Write the formatted message to the clipboard. This is the extension's single purpose.                                                          |
| `offscreen`      | Service workers can't access the clipboard; an offscreen document with the `CLIPBOARD` reason performs the write.                              |
| `storage`        | Save the user's message template (`storage.sync`) and the optional GitHub token (`storage.local`).                                             |

**Host permissions:** none. The optional GitHub API fallback uses `api.github.com`, which allows cross-origin requests, so no host permission is requested.

**Remote code:** No, I am not using remote code. All JavaScript is bundled in the package.

## Data usage

- Collected data: **none** of the listed categories.
  - The optional GitHub token counts as _authentication information_, but it's stored only on the user's device and sent only to `api.github.com` to read pull request details. It's never sent to the developer. If the reviewer asks, declare it as _Authentication information_, used only for the app's functionality.
- Certifications (check all three):
  - I do not sell or transfer user data to third parties, outside of the approved use cases.
  - I do not use or transfer user data for purposes that are unrelated to my item's single purpose.
  - I do not use or transfer user data to determine creditworthiness or for lending purposes.
