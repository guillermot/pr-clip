# Publishing to the Chrome Web Store

## One-time setup

### 1. Developer account

1. Register at the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole). There is a one-time US$5 fee.
2. Turn on 2-step verification for the Google account, which the Store requires to publish.
3. Under **Account**, verify the contact email.

### 2. Privacy policy page

In the GitHub repo, go to **Settings → Pages**, choose _Deploy from a branch_, then `main` and `/docs`. The policy is then served at https://guillermot.github.io/pr-clip/PRIVACY.

### 3. First submission (manual)

1. Download `pr-clip-<version>-chrome.zip` from the latest [GitHub Release](https://github.com/guillermot/pr-clip/releases), or run `pnpm zip`.
2. In the dashboard: **New item** → upload the zip.
3. **Store listing:** fill it in from [`store/listing.md`](../store/listing.md) and upload the images from `store/assets/`.
4. **Privacy practices:** copy the answers from [`store/privacy-practices.md`](../store/privacy-practices.md).
5. **Distribution:** Public, all regions.
6. **Submit for review.** Reviews usually take a few days.

## Automated releases (after the first submission)

The `Release` workflow can upload and submit every new GitHub Release using the Chrome Web Store API v2 with a service account:

1. In [Google Cloud](https://console.cloud.google.com/), create a project, enable the **Chrome Web Store API**, and create a **service account** with a JSON key.
2. In the Developer Dashboard → **Account**, add the service account email under _Service accounts_.
3. Add these repository secrets (**Settings → Secrets and variables → Actions**):

   | Secret                                | Value                              |
   | ------------------------------------- | ---------------------------------- |
   | `CHROME_EXTENSION_ID`                 | The item ID from the dashboard URL |
   | `CHROME_PUBLISHER_ID`                 | Publisher ID (dashboard → Account) |
   | `CHROME_SERVICE_ACCOUNT_CLIENT_EMAIL` | `client_email` from the JSON key   |
   | `CHROME_SERVICE_ACCOUNT_PRIVATE_KEY`  | `private_key` from the JSON key    |

Until `CHROME_EXTENSION_ID` is set, the publish step is skipped. Each submission still goes through Google's review.

## Checklist for every release

- [ ] `pnpm store:assets` if the UI changed, then commit the new images
- [ ] Listing text still accurate (`store/listing.md`)
- [ ] Permissions unchanged, or justifications updated (`store/privacy-practices.md`)
