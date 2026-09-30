// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const perfectionist = require("eslint-plugin-perfectionist");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    plugins: {
      perfectionist,
    },
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      curly: ["error", "all"],
      "no-console": ["error", { allow: ["warn", "info"] }],
      // Orden de miembros de clase: inject() → inputs/outputs/queries → signals → resto de
      // propiedades (protected antes que private) → constructor → hooks → métodos.
      "perfectionist/sort-classes": [
        "error",
        {
          type: "unsorted",
          customGroups: [
            {
              groupName: "injected",
              selector: "property",
              elementValuePattern: "^inject\\(",
            },
            {
              groupName: "signal-io",
              selector: "property",
              elementValuePattern:
                "^(input|output|model|viewChild|viewChildren|contentChild|contentChildren)(\\.required)?[<(]",
            },
            {
              groupName: "signals",
              selector: "property",
              elementValuePattern:
                "^(signal|computed|linkedSignal|toSignal|resource|rxResource|httpResource)[<(]",
            },
            {
              groupName: "lifecycle",
              selector: "method",
              elementNamePattern:
                "^ng(OnChanges|OnInit|DoCheck|AfterContentInit|AfterContentChecked|AfterViewInit|AfterViewChecked|OnDestroy)$",
            },
          ],
          groups: [
            "index-signature",
            "static-property",
            "injected",
            "signal-io",
            "signals",
            "public-property",
            "protected-property",
            "private-property",
            "constructor",
            "lifecycle",
            ["public-get-method", "public-set-method"],
            "public-method",
            ["protected-get-method", "protected-set-method"],
            "protected-method",
            ["private-get-method", "private-set-method"],
            "private-method",
            "static-method",
            "unknown",
          ],
        },
      ],
    },
  },
  {
    // Un fallo al arrancar la app no tiene interfaz donde mostrarse.
    files: ["src/main.ts"],
    rules: {
      "no-console": "off",
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  }
);
