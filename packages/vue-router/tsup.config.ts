import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/rsbuild/index.ts',
    'src/rsbuild/virtual-loader.ts',
    'src/vite/index.ts',
    'src/webpack/index.ts'
  ],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true
});
