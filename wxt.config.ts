import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  manifest: {
    name: '__MSG_extName__',
    description: '__MSG_extDescription__',
    default_locale: 'en',
    homepage_url: 'https://github.com/guillermot/pr-clip',
    permissions: ['activeTab', 'scripting', 'clipboardWrite', 'offscreen', 'storage'],
    action: {
      default_title: '__MSG_actionTitle__',
    },
    commands: {
      _execute_action: {
        suggested_key: { default: 'Alt+Shift+C' },
        description: '__MSG_commandCopy__',
      },
    },
  },
});
