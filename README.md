# vite-plugin-html-include

Ultra-lightweight, zero-config Vite plugin for raw HTML partial includes. No templating, no AST, no dependencies — just regex-based string replacement.

## Trade-offs & rules

- **It is intentionally "dumb" and fast.** No variables, no props, no conditionals. `<include>` tags are replaced with the raw file content and nothing else.
- **Paths resolve relative to the project root** (`process.cwd()`), not the host HTML file. Use paths like `src/partials/header.html`.

## Install

```bash
npm install -D vite-plugin-html-include
```

## Setup

```js
// vite.config.js
import htmlInclude from 'vite-plugin-html-include'

export default {
  plugins: [htmlInclude()],
}
```

Optionally override the root for include resolution:

```js
htmlInclude({ root: '/custom/root' })
```

## Usage

**index.html** (main page):

```html
<!DOCTYPE html>
<html>
  <body>
    <include src="src/partials/header.html"></include>
    <main>Hello world</main>
    <include src="src/partials/footer.html"></include>
  </body>
</html>
```

**src/partials/header.html** (a partial):

```html
<header>
  <nav><a href="/">Home</a></nav>
</header>
```

## HMR

In dev mode, included files are watched. Editing a partial triggers HMR and reloads the page.
