module.exports = {
  root: true,
  extends: '@react-native',
  plugins: ['@tanstack/query'],
  rules: {
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-native/no-inline-styles': 'off',
    'react/no-unstable-nested-components': 'off',
    'no-unused-vars': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@tanstack/query/exhaustive-deps': 'error',
    '@tanstack/query/no-rest-destructuring': 'warn',
    '@tanstack/query/stable-query-client': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
