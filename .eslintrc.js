module.exports = {
  extends: ['eslint:recommended', 'plugin:vue/recommended', 'prettier/vue'],
  rules: {
    'vue/max-attributes-per-line': 'off',
    'vue/require-prop-types': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-self-closing': 'off',
    'no-console': 'off',
    'max-len': 'off',
    quotes: ['error', 'single']
  }
};
