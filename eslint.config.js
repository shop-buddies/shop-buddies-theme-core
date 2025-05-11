import { Linter } from "eslint"
import typescript from "@typescript-eslint/eslint-plugin"
import typescriptParser from "@typescript-eslint/parser"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"

/** @type {Linter.FlatConfig[]} */
export default [
  {
    files: ["./src/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      react,
      "react-hooks": reactHooks,
    },
    rules: {
      ...typescript.configs.strict.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/consistent-type-assertions": [
        "error",
        { assertionStyle: "never" },
      ],
      "@typescript-eslint/explicit-module-boundary-types": ["off"],
      "@typescript-eslint/no-explicit-any": ["error"],
      "@typescript-eslint/no-invalid-void-type": [
        "error",
        { allowAsThisParameter: true },
      ],
      "@typescript-eslint/no-unused-vars": ["warn"],
      "@typescript-eslint/no-use-before-define": ["error"],
      "@typescript-eslint/prefer-ts-expect-error": ["error"],
      "@typescript-eslint/explicit-function-return-type": ["warn"],
      curly: ["error"],
      eqeqeq: ["error", "smart"],
      "func-style": ["error", "expression"],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-irregular-whitespace": ["error", { skipTemplates: true }],
      "no-unused-vars": ["off"],
      "no-use-before-define": ["off"],
      "one-var": ["error", "never"],
      "prefer-promise-reject-errors": ["error"],
      "react-hooks/exhaustive-deps": ["error"],
      "react/prop-types": ["off"],
      "react/react-in-jsx-scope": ["off"],
    },
    ignores: ["src/devops/**/*.js", "node_modules/", "*.config.js", "gulpfile.js"],
    settings: {
      react: {
        version: "detect",
      },
    },
  },
]
