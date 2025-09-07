// eslint.config.cjs
const js = require("@eslint/js");
const react = require("eslint-plugin-react");
const reactHooks = require("eslint-plugin-react-hooks");
const babelParser = require("@babel/eslint-parser");
const globals = require("globals");

module.exports = [
  // Recomandările de bază
  js.configs.recommended,

  // Codul aplicației (browser: JSX, window/document/navigator/setTimeout etc.)
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: { presets: ["@babel/preset-react"] },
        ecmaFeatures: { jsx: true }
      },
      // <-- AICI sunt globalele care îți lipseau
      globals: {
        ...globals.browser,   // window, document, navigator, setTimeout, etc.
        ...globals.es2021,
        ...globals.node       // console, process (dacă ai utilitare care folosesc astea)
      }
    },
    plugins: { react, "react-hooks": reactHooks },
    settings: { react: { version: "detect" } },
    rules: {
      "react/prop-types": "off",
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Opțional, ca să nu te înțepe pe stil
      "no-empty": ["error", { "allowEmptyCatch": true }]
      // poți adăuga și: "no-unused-vars": ["warn", { "argsIgnorePattern": "^_"}]
    }
  },

  // (Opțional) Config pentru fișiere de config / scripts Node (vite.config, scripts/*.cjs etc.)
  {
    files: ["**/*.{cjs,mjs}"],
    ignores: ["node_modules/**"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.node,
        ...globals.es2021
      }
    }
  }
];
