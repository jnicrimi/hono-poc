/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard"],
  ignoreFiles: ["**/dist/**"],
  rules: {
    // Tailwind v4 が定義する at-rule を未知扱いしない
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "theme",
          "source",
          "utility",
          "variant",
          "custom-variant",
          "apply",
          "reference",
          "config",
          "plugin",
        ],
      },
    ],
    // Tailwind v4 の @import は文字列表記が前提
    "import-notation": "string",
    // shadcn の oklch トークン表記を許容する
    "lightness-notation": null,
    "hue-degree-notation": null,
  },
};
