module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: "babel-eslint"
  },
  extends: [
    "@nuxtjs",
    "@nuxtjs/eslint-config-typescript",
    "plugin:nuxt/recommended"
  ],
  rules: {
    "arrow-parens": ["error", "as-needed"],
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "space-before-function-paren": [
      "error",
      {
        anonymous: "never",
        named: "never",
        asyncArrow: "always"
      }
    ],
    "vue/name-property-casing": ["error", "kebab-case"],
    "vue/html-self-closing": [
      "error",
      {
        html: {
          void: "always",
          normal: "always",
          component: "always"
        },
        svg: "always",
        math: "always"
      }
    ]
  }
};
