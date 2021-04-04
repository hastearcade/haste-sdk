module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['./tsconfig.json'],
        sourceType: 'module',
        tsconfigRootDir: __dirname,
    },
    plugins: ['@typescript-eslint', 'jest'],
    extends: [
        'eslint-config-standard',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/typescript',
        'plugin:jest/recommended',
        'prettier',
    ],
    env: {
        node: true,
        browser: true,
        jest: true,
        serviceworker: true,
    },
    ignorePatterns: ['build', '.*.js', '*.config.js', 'node_modules'],
    rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-use-before-define': 'warn',
        'import/no-extraneous-dependencies': ['error'],
        'import/no-self-import': 'error',
        'import/no-useless-path-segments': ['error', { noUselessIndex: true }],
        'import/prefer-default-export': 'off',
    },
};
