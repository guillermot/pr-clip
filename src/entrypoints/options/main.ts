import { localizeDocument, t, type MessageKey } from '@/lib/i18n';
import { githubTokenSetting, templateSetting } from '@/lib/settings';
import {
  DEFAULT_TEMPLATE,
  PLACEHOLDERS,
  renderTemplate,
  SAMPLE_PR,
  type Placeholder,
} from '@/lib/template';

const PLACEHOLDER_DESCRIPTIONS: Record<Placeholder, MessageKey> = {
  title: 'placeholderTitle',
  url: 'placeholderUrl',
  added: 'placeholderAdded',
  removed: 'placeholderRemoved',
  repo: 'placeholderRepo',
  owner: 'placeholderOwner',
  number: 'placeholderNumber',
};

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
const tokenForm = byId('token-form', HTMLFormElement);
const tokenInput = byId('token', HTMLInputElement);
const removeTokenButton = byId('remove-token', HTMLButtonElement);
const tokenStatus = byId('token-status', HTMLSpanElement);

function updatePreview(): void {
  preview.value = renderTemplate(textarea.value, SAMPLE_PR);
}

function showStatus(target: HTMLElement, key: MessageKey, kind: 'success' | 'error'): void {
  target.textContent = t(key);
  target.dataset.kind = kind;
}

function insertPlaceholder(key: Placeholder): void {
  textarea.setRangeText(`{${key}}`, textarea.selectionStart, textarea.selectionEnd, 'end');
  textarea.focus();
  updatePreview();
}

function renderPlaceholders(): void {
  for (const key of PLACEHOLDERS) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = `{${key}}`;
    button.title = t(PLACEHOLDER_DESCRIPTIONS[key]);
    button.addEventListener('click', () => {
      insertPlaceholder(key);
    });
    const item = document.createElement('li');
    item.append(button);
    placeholderList.append(item);
  }
}

async function saveTemplate(): Promise<void> {
  const template = textarea.value.trim();
  if (!template) {
    showStatus(status, 'statusTemplateEmpty', 'error');
    return;
  }
  await templateSetting.setValue(template);
  showStatus(status, 'statusSaved', 'success');
}

async function showTokenState(): Promise<void> {
  const saved = (await githubTokenSetting.getValue()) !== null;
  tokenInput.value = '';
  tokenInput.placeholder = t(saved ? 'tokenSavedPlaceholder' : 'tokenPlaceholder');
  removeTokenButton.disabled = !saved;
}

async function saveToken(): Promise<void> {
  const token = tokenInput.value.trim();
  if (!token) {
    showStatus(tokenStatus, 'statusTokenMissing', 'error');
    return;
  }
  await githubTokenSetting.setValue(token);
  await showTokenState();
  showStatus(tokenStatus, 'statusTokenSaved', 'success');
}

async function removeToken(): Promise<void> {
  await githubTokenSetting.removeValue();
  await showTokenState();
  showStatus(tokenStatus, 'statusTokenRemoved', 'success');
}

async function showShortcut(): Promise<void> {
  const commands = await browser.commands.getAll();
  const action = commands.find((command) => command.name === '_execute_action');
  shortcut.textContent = action?.shortcut || t('shortcutNotSet');
}

textarea.addEventListener('input', () => {
  status.textContent = '';
  updatePreview();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  void saveTemplate();
});

resetButton.addEventListener('click', () => {
  textarea.value = DEFAULT_TEMPLATE;
  updatePreview();
  void saveTemplate();
});

openShortcuts.addEventListener('click', (event) => {
  event.preventDefault();
  void browser.tabs.create({ url: 'chrome://extensions/shortcuts' });
});

tokenForm.addEventListener('submit', (event) => {
  event.preventDefault();
  void saveToken();
});

removeTokenButton.addEventListener('click', () => {
  void removeToken();
});

document.documentElement.lang = browser.i18n.getUILanguage();
localizeDocument();
renderPlaceholders();
textarea.value = await templateSetting.getValue();
updatePreview();
await Promise.all([showShortcut(), showTokenState()]);
