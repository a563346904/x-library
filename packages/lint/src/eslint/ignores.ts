/**
 * ESLint 忽略配置模块
 */

// 基础忽略项
const baseIgnorePatterns = [
  // 依赖和包管理
  'node_modules/**',
  '**/node_modules/**',

  // 构建产物目录
  'dist/**',
  '**/dist/**',
  'build/**',
  '**/build/**',
  'out/**',
  '**/out/**',

  // 自动生成的文件
  '**/*.d.ts',

  // 测试和覆盖率
  'coverage/**',
  '**/coverage/**',

  // 缓存文件
  '.eslintcache',
  '**/.eslintcache',

  // 日志文件
  '*.log',
  'logs/**',
  '**/logs/**',

  // 系统生成文件
  '.DS_Store',
  '.DS_Store?',
  '._*',
  'Thumbs.db',

  // 编辑器临时文件
  '*.swp',
  '*.swo',
  '*~',

  // 环境配置文件
  '.env',
  '.env.*'
];

/**
 * 创建忽略配置
 * @param additionalIgnores 要添加的自定义忽略项
 */
export function createIgnoresConfig(additionalIgnores: string[] = []) {
  return {
    ignores:
      additionalIgnores.length > 0
        ? [...baseIgnorePatterns, ...additionalIgnores]
        : baseIgnorePatterns
  };
}

// 基础忽略配置
export const baseIgnores = createIgnoresConfig();
