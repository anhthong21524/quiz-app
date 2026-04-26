import pluginVue from "eslint-plugin-vue";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  ...pluginVue.configs["flat/recommended"],

  {
    files: ["src/**/*.vue", "src/**/*.ts"],
    languageOptions: {
      parser: (await import("vue-eslint-parser")).default,
      parserOptions: {
        parser: tsParser,
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      "vue/no-restricted-html-elements": [
        "error",
        {
          element: "table",
          message: "Use <AppTable> (components/AppTable.vue) instead of a raw <table>.",
        },
        {
          element: "thead",
          message: "Use <AppTable> (components/AppTable.vue) instead of raw table markup.",
        },
        {
          element: "tbody",
          message: "Use <AppTable> (components/AppTable.vue) instead of raw table markup.",
        },
        {
          element: "th",
          message: "Use <AppTable> (components/AppTable.vue) instead of raw <th>.",
        },
      ],

      "vue/multi-word-component-names": "off",
      "vue/require-default-prop": "off",
      "vue/attributes-order": "off",
      "vue/first-attribute-linebreak": "off",
      "vue/max-attributes-per-line": "off",
      "vue/singleline-html-element-content-newline": "off",
      "vue/multiline-html-element-content-newline": "off",
      "vue/html-self-closing": "off",
      "vue/html-indent": "off",
      "vue/html-closing-bracket-newline": "off",
    },
  },

  {
    files: ["src/components/AppTable.vue"],
    rules: { "vue/no-restricted-html-elements": "off" },
  },
];
