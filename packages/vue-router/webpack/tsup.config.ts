import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false, // 暂时关闭类型生成
  splitting: false,
  sourcemap: true,
  clean: true,
  // 将所有 node_modules 依赖标记为外部
  external: [/node_modules/],
  // 打包共享代码
  noExternal: [/^\.\.\/\.\.\/shared/]
});
