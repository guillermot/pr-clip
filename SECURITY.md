# Security Policy

## Supported versions

Only the latest release, as published on the Chrome Web Store and in GitHub Releases, receives fixes.

## Reporting a vulnerability

Please **do not open a public issue**. Report it privately via [GitHub Security Advisories](https://github.com/guillermot/pr-clip/security/advisories/new).

You can expect an acknowledgement within a few days. Once a fix is released, the advisory is published with credit, unless you prefer to stay anonymous.

## Scope

Of particular interest:

- Anything that could leak the optional GitHub token, which is stored in `chrome.storage.local` and sent only to `api.github.com`.
- Script injection through PR titles or templates.
- Permission escalation beyond `activeTab`, `scripting`, `offscreen`, and `storage`.
