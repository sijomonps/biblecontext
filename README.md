# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  # BibleContext

  Simple, one-line Bible chapter summaries in English and Malayalam to help beginners read with clarity and understanding.

  ## Run locally

  ```bash
  npm install
  npm run dev
  ```

  ## Build

  ```bash
  npm run build
  ```

  ## Tech

  - React + TypeScript
  - Vite
  - Tailwind CSS
  - React Router

  ## Notes

  - Data is static and stored in `src/data/bibleData.ts`.
  - Progress and language preference are stored in localStorage.
```js
