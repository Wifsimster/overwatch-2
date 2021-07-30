module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:vue/essential'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 2018,
    sourceType: 'module',
    requireConfigFile: false,
  },
  env: {
    browser: true,
    es2021: true,
  },
  plugins: ['vue'],
  globals: {
    ga: 'readonly', // Google Analytics
    cordova: 'readonly',
    __statics: 'readonly',
    __QUASAR_SSR__: 'readonly',
    __QUASAR_SSR_SERVER__: 'readonly',
    __QUASAR_SSR_CLIENT__: 'readonly',
    __QUASAR_SSR_PWA__: 'readonly',
    process: 'readonly',
    Capacitor: 'readonly',
    chrome: 'readonly'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    indent: ['error', 2], // indent with 2 spaces
    quotes: ['error', 'single'], // force single quotes
    semi: ['error', 'never'], // remove semicolons
    eqeqeq: 'warn', // require === and !==
    curly: ['error', 'all'],
    yoda: 'warn', // requires 'yoda' condition statements
    'linebreak-style': 'off', // don't matter line ending style
    'default-case': 'warn', // require default case in switch statements
    'no-implicit-coercion': 'warn', // disallows implicit type conversion methods
    'no-var': 'warn', // requires let or const, not var
    'vue/no-unused-vars': 'off',
    'max-len': 'off',
  },
}
