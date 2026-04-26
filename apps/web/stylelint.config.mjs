export default {
  customSyntax: "postcss-html",
  rules: {
    "declaration-property-value-disallowed-list": {
      "/^overflow(-y)?$/": ["/^(auto|scroll)$/"],
    },
  },
};
