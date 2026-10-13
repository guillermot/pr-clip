# PR Clip

[![CI](https://github.com/guillermot/pr-clip/actions/workflows/ci.yml/badge.svg)](https://github.com/guillermot/pr-clip/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Copy a GitHub pull request as a clean, shareable one-liner for Slack and other chat apps.

On any pull request, click the PR Clip icon (or press <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>C</kbd>) and paste:

```
:github: `+120 -30` [Add dark mode to the settings page](https://github.com/acme/widgets/pull/42)
```

In Slack that renders as the `:github:` emoji, the diff size, and the PR title linked to the PR. Your teammates see at a glance what the PR is and how big the review is.

## Features

- **One click or one shortcut** from any PR tab (conversation, commits, files changed).
- **Editable template** with placeholders: `{title}` `{url}` `{added}` `{removed}` `{repo}` `{owner}` `{number}`.
- **Works on private repos.** Details are read from the page you're viewing; an optional token covers the API fallback.
- **Private by design.** No analytics, no servers, and no access to any site until you click the icon.
- English and Spanish UI.

## Install

- **Chrome Web Store:** coming soon.
- **From a release:** download `pr-clip-*-chrome.zip` from [Releases](https://github.com/guillermot/pr-clip/releases), unzip it, open `chrome://extensions`, enable _Developer mode_, and choose _Load unpacked_.
- **From source:** see [CONTRIBUTING.md](CONTRIBUTING.md).

## Usage

1. Open a pull request on github.com.
2. Click the PR Clip icon or press <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>C</kbd>. A green ✓ on the icon means the message is on your clipboard; a red ! shows what went wrong when you hover it.
3. Paste it into Slack.

### Customizing the message

Right-click the icon → **Options**. Examples:

| Template                                                            | Result                                  |
| ------------------------------------------------------------------- | --------------------------------------- |
| ``:github: `+{added} -{removed}` [{title}]({url})``                 | default                                 |
| ``:github: `+{added} -{removed}` [{repo}#{number} {title}]({url})`` | adds `acme/widgets#42` before the title |
| `[{title}]({url}) ({added}+/{removed}-)`                            | no emoji                                |

`:github:` is a common custom emoji in Slack workspaces; replace it with any emoji you have.

### Private repositories

PR Clip reads the title and line counts from the page you're looking at, so private repos usually just work. If the page hasn't finished loading, PR Clip asks the GitHub API instead, and the API needs a token for private repos. To set one up, create a [fine-grained token](https://github.com/settings/personal-access-tokens/new) with read-only **Pull requests** access and paste it into the options page. The token is stored only on your device and sent only to `api.github.com`.

## FAQ

**The link shows up as `[title](url)` in Slack.**
Turn on _Preferences → Advanced → Format messages with markup_ in Slack.

**Why these permissions?**

| Permission       | Why                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------- |
| `activeTab`      | Read the PR title and line counts from the current tab, only when you click the icon. |
| `scripting`      | Run that one read-only function in the tab.                                           |
| `clipboardWrite` | Put the formatted message on your clipboard.                                          |
| `offscreen`      | Write to the clipboard from the background (Chrome extensions can't do it directly).  |
| `storage`        | Save your template (synced) and optional token (this device only).                    |

PR Clip has no access to any website until you click it.

## Contributing

Bug reports and pull requests are welcome. GitHub changes its markup from time to time, and [CONTRIBUTING.md](CONTRIBUTING.md) explains how to fix the extension when that happens.

## License

[MIT](LICENSE) © Guillermo Tamanaha
