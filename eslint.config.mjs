// 使用 @x-library/lint 包的函数式配置
import { eslintConfig } from '@x-library/lint/eslint';

// 使用标准ESLint配置格式
export default eslintConfig({
  // 标准的 ESLint ignores 配置
  ignores: [
    // 项目特有的忽略规则
    '.turbo/**', // Turbo 构建缓存目录
    'pnpm-lock.yaml', // pnpm 的依赖锁定文件

    // VitePress 相关
    'apps/docs/.vitepress/cache/**', // VitePress 缓存目录

    // 测试相关
    '**/tests/**', // 忽略所有 tests 目录
    '**/*.test.*', // 忽略所有测试文件
    '**/*.spec.*', // 忽略所有规格文件
    '**/test/**', // 忽略所有 test 目录

    // 额外的锁文件
    'yarn.lock',
    'package-lock.json'
  ],

  // 添加全局变量
  languageOptions: {
    globals: {
      definePageMeta: 'readonly'
    }
  }
});
