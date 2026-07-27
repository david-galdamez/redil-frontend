import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astroPlugin from "eslint-plugin-astro";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import prettierConfig from "eslint-config-prettier";

export default [
  { ignores: ["dist/", ".astro/", ".netlify/", ".wrangler/", "node_modules/"] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Astro files — handled by the dedicated plugin
  ...astroPlugin.configs.recommended,

  // React rules scoped only to .tsx files (Astro uses `class`, not `className`)
  {
    files: ["**/*.tsx"],
    ...reactPlugin.configs.flat.recommended,
    ...reactPlugin.configs.flat["jsx-runtime"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactPlugin.configs.flat["jsx-runtime"].rules,
      ...reactHooksPlugin.configs.recommended.rules,
      "react/prop-types": "off",
    },
    settings: {
      react: { version: "19" },
    },
  },

  // Disable ESLint formatting rules that conflict with Prettier
  prettierConfig,

  // Ambient type declarations are used globally without imports — must come last to win
  {
    files: ["src/types/**/*.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];
