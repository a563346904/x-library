import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false, // 暂时关闭类型生成
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['@rsbuild/core', 'vue', 'vue-router'],
  // 将共享代码打包进去
  noExternal: [/^\.\.\/\.\.\/shared/]
});
