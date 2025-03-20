/**
 *  @type {import('eslint').ESLint.ConfigData}
 */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: ["airbnb", "airbnb-typescript", "airbnb/hooks", "prettier"],
  plugins: [
    "react",
    "react-native",
    "jsx-a11y",
    "import",
    "react-hooks",
    "@typescript-eslint",
    "perfectionist",
    "unused-imports",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  env: {
    "react-native/react-native": true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.json",
      },
      node: {
        extensions: [
          ".js",
          ".jsx",
          ".ts",
          ".tsx",
          ".ios.js",
          ".android.js",
          ".ios.tsx",
          ".android.tsx",
        ],
      },
    },
  },

  rules: {
    // general
    "no-alert": 0,
    camelcase: 0,
    "no-console": 0,
    "no-unused-vars": 0,
    "no-nested-ternary": 0,
    "no-param-reassign": 0,
    "no-underscore-dangle": 0,
    "no-restricted-exports": 0,
    "no-promise-executor-return": 0,
    "import/prefer-default-export": 0,
    "prefer-destructuring": [1, { object: true, array: false }],
    "import/extensions": "off",
    "import/no-cycle": "off",
    // Disable problematic import rules
    "import/no-extraneous-dependencies": "off",
    "import/no-duplicates": "off",
    "import/order": "off", // We're using perfectionist instead
    "import/no-self-import": "off",
    "import/no-relative-packages": "off",
    "import/no-named-as-default": "off",
    "import/no-useless-path-segments": "off",
    "react/style-prop-object": "off",
    // react
    "react/no-children-prop": 0,
    "react/react-in-jsx-scope": 0,
    "react/no-array-index-key": 0,
    "react/require-default-props": 0,
    "react/jsx-props-no-spreading": 0,
    "react/function-component-definition": 0,
    "react/jsx-no-useless-fragment": [1, { allowExpressions: true }],
    "react/no-unstable-nested-components": [1, { allowAsProps: true }],
    "react/jsx-no-duplicate-props": [1, { ignoreCase: false }],

    // TypeScript
    "@typescript-eslint/naming-convention": 0,
    "@typescript-eslint/no-use-before-define": 0,
    "@typescript-eslint/consistent-type-exports": 1,
    "@typescript-eslint/consistent-type-imports": 1,
    "@typescript-eslint/no-unused-vars": [1, { args: "none" }],

    // React Native
    "react-native/no-unused-styles": 1,
    "react-native/split-platform-components": 1,
    "react-native/no-inline-styles": 0,
    "react-native/no-color-literals": 0,
    "react-native/no-raw-text": 0,

    // jsx-a11y
    "jsx-a11y/anchor-is-valid": 0,
    "jsx-a11y/control-has-associated-label": 0,
    // Unused imports
    "unused-imports/no-unused-imports": 1,
    "unused-imports/no-unused-vars": [
      0,
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],

    // Perfectionist (version simplifiée)
    "perfectionist/sort-imports": [
      1,
      {
        order: "asc",
        type: "line-length",
      },
    ],
    "perfectionist/sort-named-imports": [
      1,
      { order: "asc", type: "line-length" },
    ],
    "perfectionist/sort-named-exports": [
      1,
      { order: "asc", type: "line-length" },
    ],
    "perfectionist/sort-exports": [1, { order: "asc", type: "line-length" }],
  },
};
