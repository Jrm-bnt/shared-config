# csspace-eslint-config

<span style="color: #ff2929; font-weight: bold;">⚠️</span> <span style="color: #ff2929; font-weight: bold;">Warning:</span>

**This config is maintained using ESLint Flat Config only (ESLint v9+). .eslintrc is not supported.**

**If you encounter PNPM-related installation errors:**
1. Install PNPM globally: `npm install -g pnpm`
2. Verify PNPM is in your system PATH
3. Restart your terminal after installation


## 🔧 A modern, opinionated ESLint + Prettier shared config for JavaScript and React 
projects – built on Airbnb conventions and compatible with ESLint 9+ (Flat Config).

## ✨ Features

- ✅ ESLint 9+ (Flat Config) ready
- 💡 Based on Airbnb style rules (manually reconstructed for Flat Config)
- 🧼 Prettier integrated (no conflicts)
- ⚛️ Supports React, JSX, hooks, a11y
- 🧪 Git hooks via Husky + lint-staged
- ⚙️ One-command project setup with `npx csspace-eslint-setup`

---

## 📦 Installation

```bash
  pnpm install -D csspace-eslint-config
```

## ⚡ One-command setup (recommended)
Run this command in your project:

```bash
  pnpm csspace-eslint-setup
```
This will automatically:

1. [x] Create eslint.config.js file
2. [x] Install all required dependencies
3. [x] Add lint scripts to package.json
4. [x] Configure Husky + lint-staged
5. [x] Set up a pre-commit Git hook

### Add configuration

#### Example eslint.config.js
```js
import csspace from 'csspace-eslint-config';

export default [
  ...csspace,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      
    },
  },
];
```

## 🧑‍💻 Manual setup (if you prefer)

### 1. Add ESLint Flat Config

Create a file named eslint.config.js at your project root:

```js
import csspace from 'csspace-eslint-config'

export default csspace
```

### 2. Install dependencies

```bash
  pnpm install -D eslint@^9.0.0 eslint-config-airbnb@^19.0.0 eslint-config-prettier@^9.0.0 \
  eslint-import-resolver-alias@^1.1.2 eslint-plugin-import@^2.31.0 eslint-plugin-prettier@^5.0.0 \
  eslint-plugin-react@^7.0.0 husky@^8.0.0 lint-staged@^13.0.0 globals@^16.0.0 prettier@^3.0.0
```

### 3. (Optional) Set up Husky + lint-staged manually:
```bash
   pnpm install -D husky lint-staged
   pnpx husky install
   pnpx husky add .husky/pre-commit "npx lint-staged"
```
   And update your package.json:

```json
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "**/*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "**/*.{json,css,md}": ["prettier --write"]
}
```
### 🧠 Why use this config?
You want a consistent, battle-tested ESLint + Prettier setup

You want to follow Airbnb-style best practices

You want Git hooks to prevent bad commits

You want a fast setup across multiple projects

### 🛠 Technologies & Plugins Used
Pnpm

ESLint (Flat Config mode)

Prettier

eslint-plugin-react

eslint-plugin-import

eslint-plugin-jsx-a11y

eslint-plugin-prettier

husky

lint-staged

### 💬 Notes
Compatible with Vite.
