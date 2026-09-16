import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import sonarjs from "eslint-plugin-sonarjs";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import importX from "eslint-plugin-import-x";
import prettier from "eslint-config-prettier";

// TOOLCHAIN.md §3: inherited rules, all set to error. Fully active since 16-sep-2026
// (the temporary OFF is over: no-magic-numbers, naming-convention, id-length, no-shadow).
const MAX_COMPLEXITY = 8;
const MAX_FUNCTION_LINES = 100;
const MAX_PARAMS = 4;

const toolchainRules = {
  "@typescript-eslint/no-unsafe-assignment": "error",
  "@typescript-eslint/no-unsafe-member-access": "error",
  "@typescript-eslint/no-unsafe-call": "error",
  "@typescript-eslint/no-unsafe-return": "error",
  "@typescript-eslint/no-unsafe-argument": "error",
  "@typescript-eslint/strict-boolean-expressions": "error",
  "@typescript-eslint/no-floating-promises": "error",
  "@typescript-eslint/no-misused-promises": "error",
  "@typescript-eslint/return-await": "error",
  "@typescript-eslint/only-throw-error": "error",
  "@typescript-eslint/prefer-promise-reject-errors": "error",
  "@typescript-eslint/no-magic-numbers": "error",
  "@typescript-eslint/naming-convention": [
    "error",
    { selector: "default", format: ["camelCase"], leadingUnderscore: "allow" },
    { selector: "variable", format: ["camelCase", "UPPER_CASE"] },
    // Documented exemption: PascalCase zod schemas (ecosystem convention,
    // they read as types/validators, e.g. WizardNeedSchema).
    { selector: "variable", format: null, filter: { regex: "Schema$", match: true } },
    { selector: "function", format: ["camelCase", "PascalCase"] },
    // Documented exemption: Next.js route handlers must be uppercase
    // (GET/POST/...). Framework API, not our naming.
    { selector: "function", format: null, filter: { regex: "^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)$", match: true } },
    { selector: "parameter", format: ["camelCase"], leadingUnderscore: "allow" },
    { selector: "enumMember", format: ["PascalCase"] },
    { selector: "typeLike", format: ["PascalCase"] },
    { selector: "import", format: ["camelCase", "PascalCase", "UPPER_CASE"] },
    // Documented exemptions: external API keys, not our naming —
    // `@context`/`@type` (schema.org), `__html` (React), remaining snake_case (Next metadata API).
    { selector: "property", format: null, filter: { regex: "^(@|__html$)", match: true } },
    { selector: "property", format: ["camelCase", "UPPER_CASE", "snake_case"] },
  ],
  "id-length": "error",
  "@typescript-eslint/no-shadow": "error",
  complexity: ["error", MAX_COMPLEXITY],
  "max-lines-per-function": ["error", MAX_FUNCTION_LINES],
  "max-params": ["error", MAX_PARAMS],
  "@typescript-eslint/prefer-readonly": "error",
  "prefer-as-const": "off",
  "@typescript-eslint/prefer-as-const": "error",
  "sonarjs/no-duplicate-string": "error",
  "sonarjs/no-identical-functions": "error",
  "sonarjs/no-redundant-boolean": "error",
  "sonarjs/cognitive-complexity": "error",
  "sonarjs/no-collapsible-if": "error",
  "sonarjs/no-collection-size-mischeck": "error",
  "sonarjs/no-duplicated-branches": "error",
  "sonarjs/no-element-overwrite": "error",
  "react/no-danger": "error",
  "react/no-unescaped-entities": "error",
  "react-hooks/rules-of-hooks": "error",
  "import-x/consistent-type-specifier-style": "error",
  "import-x/no-cycle": "error",
  "import-x/order": "error",
};

const toolchainPlugins = {
  "@typescript-eslint": tsPlugin,
  sonarjs,
  react: reactPlugin,
  "react-hooks": reactHooks,
  "import-x": importX,
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.mts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: toolchainPlugins,
    settings: { react: { version: "detect" } },
    rules: toolchainRules,
  },
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    plugins: toolchainPlugins,
    settings: { react: { version: "detect" } },
    rules: {
      // Subset without type-information (the JS parser does not produce types).
      complexity: ["error", MAX_COMPLEXITY],
      "max-lines-per-function": ["error", MAX_FUNCTION_LINES],
      "max-params": ["error", MAX_PARAMS],
      "id-length": "error",
      "no-shadow": "error",
      "no-magic-numbers": "error",
      "sonarjs/no-duplicate-string": "error",
      "sonarjs/no-identical-functions": "error",
      "sonarjs/no-redundant-boolean": "error",
      "sonarjs/cognitive-complexity": "error",
      "sonarjs/no-collapsible-if": "error",
      "sonarjs/no-collection-size-mischeck": "error",
      "sonarjs/no-duplicated-branches": "error",
      "sonarjs/no-element-overwrite": "error",
      "react-hooks/rules-of-hooks": "error",
      "import-x/consistent-type-specifier-style": "error",
      "import-x/no-cycle": "error",
      "import-x/order": "error",
    },
  },
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
