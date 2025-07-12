import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'index.ts',
    'layouts/index': 'layouts/index.ts',
    'layouts/macros': 'layouts/macros.ts'
  },
  format: ['cjs', 'esm'],
  dts: {
    tsconfig: './tsconfig.build.json'
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['vue', 'vue-router', '@x-library/core']
});
