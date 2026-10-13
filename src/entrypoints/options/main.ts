import { templateSetting } from '@/lib/settings';
import {
  DEFAULT_TEMPLATE,
  PLACEHOLDERS,
  renderTemplate,
  SAMPLE_PR,
  type Placeholder,
} from '@/lib/template';

function byId<T extends HTMLElement>(id: string, type: new () => T): T {
  const element = document.getElementById(id);
  if (!(element instanceof type)) throw new Error(`Missing #${id}`);
  return element;
}

const form = byId('template-form', HTMLFormElement);
const textarea = byId('template', HTMLTextAreaElement);
const preview = byId('preview', HTMLOutputElement);
const placeholderList = byId('placeholders', HTMLUListElement);
const resetButton = byId('reset', HTMLButtonElement);
const status = byId('status', HTMLSpanElement);
const shortcut = byId('shortcut', HTMLElement);
const openShortcuts = byId('open-shortcuts', HTMLAnchorElement);

function updatePreview(): void {
  preview.value = renderTemplate(textarea.value, SAMPLE_PR);
}

function showStatus(message: string, kind: 'success' | 'error'): void {
  status.textContent = message;
  status.dataset.kind = kind;
}

function insertPlaceholder(key: Placeholder): void {
  textarea.setRangeText(`{${key}}`, textarea.selectionStart, textarea.selectionEnd, 'end');
  textarea.focus();
  updatePreview();
}

function renderPlaceholders(): void {
  for (const [key, description] of Object.entries(PLACEHOLDERS) as [Placeholder, string][]) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = `{${key}}`;
    button.title = description;
    button.addEventListener('click', () => {
      insertPlaceholder(key);
    });
    const item = document.createElement('li');
    item.append(button);
    placeholderList.append(item);
  }
}

async function save(): Promise<void> {
  const template = textarea.value.trim();
  if (!template) {
    showStatus('The template can’t be empty.', 'error');
    return;
  }
  await templateSetting.setValue(template);
  showStatus('Saved.', 'success');
}

async function showShortcut(): Promise<void> {
  const commands = await browser.commands.getAll();
  const action = commands.find((command) => command.name === '_execute_action');
  shortcut.textContent = action?.shortcut || 'Not set';
}

textarea.addEventListener('input', () => {
  status.textContent = '';
  updatePreview();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  void save();
});

resetButton.addEventListener('click', () => {
  textarea.value = DEFAULT_TEMPLATE;
  updatePreview();
  void save();
});

openShortcuts.addEventListener('click', (event) => {
  event.preventDefault();
  void browser.tabs.create({ url: 'chrome://extensions/shortcuts' });
});

renderPlaceholders();
textarea.value = await templateSetting.getValue();
updatePreview();
await showShortcut();
