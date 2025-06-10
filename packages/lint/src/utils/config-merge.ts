/**
 * 通用配置合并工具
 * 提供深度合并、数组合并等功能，适用于各种配置对象
 */

/**
 * 表示可以合并的对象类型
 */
type MergeableObject = Record<string, unknown>;

/**
 * 判断是否为可合并的对象
 */
function isMergeableObject(value: unknown): value is MergeableObject {
  return typeof value === 'object' && !Array.isArray(value) && value !== null;
}

/**
 * 处理单个键值对的合并逻辑
 */
function mergeKeyValue(
  result: MergeableObject,
  key: string,
  targetValue: unknown,
  sourceValue: unknown
): void {
  // 跳过 undefined 或 null 值
  if (sourceValue === undefined || sourceValue === null) {
    return;
  }

  // 数组合并：将两个数组连接
  if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
    result[key] = [...targetValue, ...sourceValue];
    return;
  }

  // 对象深度合并
  if (isMergeableObject(targetValue) && isMergeableObject(sourceValue)) {
    result[key] = deepMerge(targetValue, sourceValue);
    return;
  }

  // 基础类型直接覆盖
  result[key] = sourceValue;
}

/**
 * 深度合并两个对象
 * @param target 目标对象（默认配置）
 * @param source 源对象（用户配置）
 * @returns 合并后的新对象
 */
export function deepMerge<T extends MergeableObject>(target: T, source: Partial<T>): T {
  const result = { ...target } as MergeableObject;

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = result[key];

      mergeKeyValue(result, key, targetValue, sourceValue);
    }
  }

  return result as T;
}

/**
 * 合并多个配置对象
 * @param baseConfig 基础配置
 * @param configs 要合并的配置数组
 * @returns 合并后的配置
 */
export function mergeConfigs<T extends MergeableObject>(
  baseConfig: T,
  ...configs: Partial<T>[]
): T {
  return configs.reduce<T>(
    (merged, config) => (config ? deepMerge(merged, config) : merged),
    baseConfig
  );
}

/**
 * 合并配置数组（适用于 ESLint 等需要配置数组的场景）
 * @param defaultConfigs 默认配置数组
 * @param userConfigs 用户配置数组
 * @returns 合并后的配置数组
 */
export function mergeConfigArrays<T>(defaultConfigs: T[], userConfigs: T[]): T[] {
  return [...defaultConfigs, ...userConfigs.filter(config => config !== undefined)];
}
