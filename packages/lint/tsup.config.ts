import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'eslint/index': 'src/eslint/index.ts',
    'prettier/index': 'src/prettier/index.ts'
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  minify: false,
  sourcemap: true
});
