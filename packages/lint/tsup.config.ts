import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'eslint/index': 'src/eslint/index.ts',
    'prettier/index': 'src/prettier/index.ts',
    'commitlint/index': 'src/commitlint/index.ts',
    'stylelint/index': 'src/stylelint/index.ts'
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  minify: false,
  sourcemap: true
});
