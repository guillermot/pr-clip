import { defineConfig } from 'wxt';
import { ACTION_TITLE } from './src/constants';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  manifest: {
    name: 'PR Clip',
    description:
      'Copy a GitHub pull request as a clean, shareable one-liner for chat apps like Slack.',
    homepage_url: 'https://github.com/guillermot/pr-clip',
    permissions: ['activeTab', 'scripting', 'clipboardWrite', 'offscreen'],
    action: {
      default_title: ACTION_TITLE,
    },
    commands: {
      _execute_action: {
        suggested_key: { default: 'Alt+Shift+C' },
        description: 'Copy the current pull request',
      },
    },
  },
});
