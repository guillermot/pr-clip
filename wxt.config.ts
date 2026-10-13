import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  manifest: {
    name: 'PR Clip',
    description:
      'Copy a GitHub pull request as a clean, shareable one-liner for chat apps like Slack.',
    homepage_url: 'https://github.com/guillermot/pr-clip',
  },
});
