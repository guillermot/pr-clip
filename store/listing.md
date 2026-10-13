# Chrome Web Store listing

Copy these fields into the Developer Dashboard (**Store listing** tab). Name and short description come from `public/_locales/*/messages.json` (`extName`, `extDescription`), so they're localized automatically.

- **Category:** Developer Tools
- **Language:** English (also localized: Spanish)
- **Homepage URL:** https://github.com/guillermot/pr-clip
- **Support URL:** https://github.com/guillermot/pr-clip/issues
- **Privacy policy URL:** https://guillermot.github.io/pr-clip/PRIVACY

## Images (`store/assets/`, regenerate with `pnpm store:assets`)

| Field                   | File                       |
| ----------------------- | -------------------------- |
| Store icon (128×128)    | `icon-128.png`             |
| Screenshot 1 (1280×800) | `screenshot-1-hero.png`    |
| Screenshot 2 (1280×800) | `screenshot-2-options.png` |
| Small promo tile        | `promo-small-440x280.png`  |

## Detailed description — English

Share GitHub pull requests in Slack, Teams, Discord or any chat, without retyping anything.

Open a pull request, click the PR Clip icon (or press Alt+Shift+C), and paste. You get a tidy one-liner with the size of the change and a link to the PR:

:github: `+120 -30` [Add dark mode to the settings page](https://github.com/acme/widgets/pull/42)

Teammates see at a glance what the PR is about and how long the review will take.

FEATURES
• One click or one keyboard shortcut, from any pull request tab
• Customizable template with placeholders: {title}, {url}, {added}, {removed}, {repo}, {owner}, {number}
• Works with private repositories: details are read from the page you're viewing
• Optional GitHub token as a fallback when the page hasn't loaded yet
• English and Spanish

PRIVACY
PR Clip has no analytics and no servers. It reads the current tab only when you click it. Your template is saved in Chrome sync storage; the optional token stays on your device and is sent only to api.github.com.

Open source (MIT): https://github.com/guillermot/pr-clip

PR Clip is an independent project and isn't affiliated with GitHub or Slack.

## Detailed description — Spanish

Comparte pull requests de GitHub en Slack, Teams, Discord o cualquier chat, sin volver a escribir nada.

Abre un pull request, haz clic en el ícono de PR Clip (o presiona Alt+Shift+C) y pega. Obtienes una línea clara con el tamaño del cambio y el link al PR:

:github: `+120 -30` [Add dark mode to the settings page](https://github.com/acme/widgets/pull/42)

Tu equipo ve de un vistazo de qué trata el PR y cuánto llevará revisarlo.

FUNCIONES
• Un clic o un atajo de teclado, desde cualquier pestaña del pull request
• Plantilla personalizable con variables: {title}, {url}, {added}, {removed}, {repo}, {owner}, {number}
• Funciona con repositorios privados: los datos se leen de la página que estás viendo
• Token de GitHub opcional como alternativa cuando la página aún no cargó
• Inglés y español

PRIVACIDAD
PR Clip no tiene analytics ni servidores. Lee la pestaña actual solo cuando haces clic. Tu plantilla se guarda en el almacenamiento sincronizado de Chrome; el token opcional queda en tu dispositivo y solo se envía a api.github.com.

Código abierto (MIT): https://github.com/guillermot/pr-clip

PR Clip es un proyecto independiente, sin relación con GitHub ni Slack.
