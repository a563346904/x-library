import type { Linter } from 'eslint';

/**
 * 表示可以合并的对象类型
 */
type DeepMergeableObject = Record<string, unknown>;

/**
 * 判断是否为合并对象的条件
 */
function isDeepMergeableObject(value: unknown): value is DeepMergeableObject {
  return typeof value === 'object' && !Array.isArray(value) && value !== null;
}

/**
 * 处理配置中的单个键值对合并
 */
function mergeKeyValue(
  result: Record<string, unknown>,
  key: string,
  defaultValue: unknown,
  value: unknown
): void {
  // 值为 undefined 或 null 时跳过
  if (value === undefined || value === null) {
    return;
  }

  // 数组合并
  if (Array.isArray(defaultValue) && Array.isArray(value)) {
    result[key] = [...defaultValue, ...value];
    return;
  }

  // 对象深度合并
  if (isDeepMergeableObject(defaultValue) && isDeepMergeableObject(value)) {
    result[key] = deepMerge(defaultValue, value);
    return;
  }

  // 基础类型覆盖
  result[key] = value;
}

/**
 * 深度合并配置选项
 */
export function mergeConfig(
  defaultConfig: Linter.Config,
  userConfig: Partial<Linter.Config>
): Linter.Config {
  const merged = { ...defaultConfig } as Record<string, unknown>;

  for (const [key, value] of Object.entries(userConfig)) {
    // 值为 undefined 或 null 时跳过
    if (value === undefined || value === null) {
      continue;
    }

    if (key in merged) {
      const defaultValue = merged[key];
      mergeKeyValue(merged, key, defaultValue, value);
    } else {
      // 新增属性
      merged[key] = value;
    }
  }

  return merged as Linter.Config;
}

/**
 * 深度合并对象
 */
function deepMerge(target: DeepMergeableObject, source: DeepMergeableObject): DeepMergeableObject {
  const result: DeepMergeableObject = { ...target };

  for (const [key, value] of Object.entries(source)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (key in result) {
      const targetValue = result[key];
      mergeKeyValue(result, key, targetValue, value);
    } else {
      // 新增属性
      result[key] = value;
    }
  }

  return result;
}

/**
 * 合并配置数组
 */
export function mergeConfigs(
  defaultConfigs: Linter.Config[],
  userConfigs: Partial<Linter.Config>[]
): Linter.Config[] {
  return [...defaultConfigs, ...userConfigs.filter(config => config !== undefined)];
}

/**
 * 配置选项类型 - 基于标准 ESLint Config 扩展
 */
export interface EslintConfigOptions extends Partial<Linter.Config> {
  /**
   * 额外的配置项（会追加到默认配置后面）
   */
  additionalConfigs?: Partial<Linter.Config>[];

  /**
   * 是否禁用某些默认配置
   */
  disable?: {
    vue?: boolean;
    typescript?: boolean;
    prettier?: boolean;
  };
}
