import * as path from 'path';

import { PathSegmentType } from '../enums';
import { ParsedPath, ParsePathOptions, ProcessedSegment, RouteMetadata } from '../types';

/**
 * 正则表达式常量
 */
const REGEXPS = {
  /**
   * 匹配动态路由参数 [param]
   */
  DYNAMIC_PARAM: /^\[([^\]]+)\]$/,

  /**
   * 匹配Vue Router风格的动态路由参数 :param
   */
  VUE_DYNAMIC_PARAM: /^:([a-zA-Z0-9_-]+)$/,

  /**
   * 移除文件扩展名
   */
  REMOVE_EXT: /\.[a-zA-Z0-9]+$/,

  /**
   * 匹配路由参数
   */
  ROUTE_PARAMS: /:([^/]+)(?:\([^)]*\))?/g
};

/**
 * 捕获所有路由的前缀
 */
const CATCH_ALL_PREFIX = '[...';

// ==================== 类型定义 ====================

/**
 * 路径段处理器接口
 */
interface PathSegmentProcessor {
  /**
   * 检查是否可以处理该路径段
   */
  canProcess(segment: string, isLastSegment: boolean): boolean;

  /**
   * 处理路径段
   */
  process(segment: string, position: number): ProcessedSegment;
}

// ==================== 路径段处理器实现 ====================

/**
 * 索引文件路径段处理器
 */
class IndexSegmentProcessor implements PathSegmentProcessor {
  canProcess(segment: string, isLastSegment: boolean): boolean {
    return segment === 'index' && isLastSegment;
  }

  process(): ProcessedSegment {
    return {
      type: PathSegmentType.Index,
      pathSegment: '', // 索引文件默认不添加到路径段中
      nameSegment: 'index',
      meta: {}
    };
  }
}

/**
 * 捕获所有路由路径段处理器
 */
class CatchAllSegmentProcessor implements PathSegmentProcessor {
  canProcess(segment: string): boolean {
    return segment.startsWith(CATCH_ALL_PREFIX) && segment.endsWith(']');
  }

  process(segment: string, position: number): ProcessedSegment {
    const paramName = segment.slice(CATCH_ALL_PREFIX.length, -1);
    return {
      type: PathSegmentType.CatchAll,
      pathSegment: `:${paramName}(.*)`,
      nameSegment: paramName,
      paramName,
      meta: {
        position
      }
    };
  }
}

/**
 * 动态路由参数 [param] 处理器
 */
class BracketDynamicSegmentProcessor implements PathSegmentProcessor {
  canProcess(segment: string): boolean {
    return REGEXPS.DYNAMIC_PARAM.test(segment);
  }

  process(segment: string, position: number): ProcessedSegment {
    const paramName = segment.match(REGEXPS.DYNAMIC_PARAM)![1];
    return {
      type: PathSegmentType.Dynamic,
      pathSegment: `:${paramName}`,
      nameSegment: paramName,
      paramName,
      meta: {
        position
      }
    };
  }
}

/**
 * Vue Router风格的动态路由参数 :param 处理器
 */
class ColonDynamicSegmentProcessor implements PathSegmentProcessor {
  canProcess(segment: string): boolean {
    return REGEXPS.VUE_DYNAMIC_PARAM.test(segment);
  }

  process(segment: string, position: number): ProcessedSegment {
    const paramName = segment.match(REGEXPS.VUE_DYNAMIC_PARAM)![1];
    return {
      type: PathSegmentType.Dynamic,
      pathSegment: `:${paramName}`,
      nameSegment: paramName,
      paramName,
      meta: {
        position
      }
    };
  }
}

/**
 * 普通路径段处理器
 */
class NormalSegmentProcessor implements PathSegmentProcessor {
  canProcess(): boolean {
    // 作为默认处理器，总是返回true
    return true;
  }

  process(segment: string): ProcessedSegment {
    return {
      type: PathSegmentType.Normal,
      pathSegment: segment,
      nameSegment: segment,
      meta: {}
    };
  }
}

/**
 * 路径段处理器工厂
 */
class PathSegmentProcessorFactory {
  private processors: PathSegmentProcessor[];

  constructor() {
    // 按优先级顺序添加处理器
    this.processors = [
      new IndexSegmentProcessor(),
      new CatchAllSegmentProcessor(),
      new BracketDynamicSegmentProcessor(),
      new ColonDynamicSegmentProcessor(),
      new NormalSegmentProcessor() // 默认处理器放最后
    ];
  }

  /**
   * 获取适合处理给定路径段的处理器
   */
  getProcessor(segment: string, isLastSegment: boolean): PathSegmentProcessor {
    for (const processor of this.processors) {
      if (processor.canProcess(segment, isLastSegment)) {
        return processor;
      }
    }

    // 理论上永远不会到达这里，因为NormalSegmentProcessor总是返回true
    throw new Error(`无法找到处理路径段 "${segment}" 的处理器`);
  }
}

// 创建处理器工厂实例
const processorFactory = new PathSegmentProcessorFactory();

// ==================== 辅助函数 ====================

/**
 * 预处理文件路径，返回标准化的路径段数组
 * @param filePath 文件路径
 * @param keepExtension 是否保留文件扩展名
 * @param toLowerCase 是否转为小写
 * @returns 处理后的路径段数组和原始路径
 */
function preprocessPath(
  filePath: string,
  keepExtension = false,
  toLowerCase = true
): { segments: string[]; rawPath: string } {
  // 标准化文件路径（处理不同操作系统的路径分隔符）
  const normalizedPath = filePath.split(/[\\/]/g);

  // 处理原始路径
  let rawPathSegments = [...normalizedPath];
  if (!keepExtension) {
    const lastIndex = rawPathSegments.length - 1;
    rawPathSegments[lastIndex] = rawPathSegments[lastIndex].replace(REGEXPS.REMOVE_EXT, '');
  }
  if (toLowerCase) {
    rawPathSegments = rawPathSegments.map(segment => segment.toLowerCase());
  }

  // 处理用于路由生成的路径段
  const segments = [...normalizedPath];
  if (!keepExtension) {
    const lastIndex = segments.length - 1;
    segments[lastIndex] = segments[lastIndex].replace(REGEXPS.REMOVE_EXT, '');
  }
  if (toLowerCase) {
    for (let i = 0; i < segments.length; i++) {
      segments[i] = segments[i].toLowerCase();
    }
  }

  return {
    segments,
    rawPath: rawPathSegments.join('/')
  };
}

/**
 * 处理单个路径段，确定其类型并提取相关信息
 * @param segment 路径段
 * @param isLastSegment 是否是最后一个路径段
 * @param position 路径段在路径中的位置
 * @returns 处理后的路径段信息
 */
function processPathSegment(
  segment: string,
  isLastSegment: boolean,
  position: number
): ProcessedSegment {
  // 使用工厂获取合适的处理器
  const processor = processorFactory.getProcessor(segment, isLastSegment);
  // 使用处理器处理路径段
  return processor.process(segment, position);
}

/**
 * 更新段分析结果
 * @param processed 已处理的路径段
 * @param results 当前分析结果
 */
function updateSegmentAnalysis(
  processed: ProcessedSegment,
  results: {
    isIndex: boolean;
    isDynamic: boolean;
    isCatchAll: boolean;
    paramNames: string[];
    meta: RouteMetadata;
  }
): void {
  if (processed.type === PathSegmentType.Index) {
    results.isIndex = true;
  } else if (
    processed.type === PathSegmentType.Dynamic ||
    processed.type === PathSegmentType.CatchAll
  ) {
    results.isDynamic = true;

    if (processed.type === PathSegmentType.CatchAll) {
      results.isCatchAll = true;
    }

    if (processed.paramName) {
      results.paramNames.push(processed.paramName);

      // 添加参数元数据
      if (processed.meta) {
        results.meta.params[processed.paramName] = processed.meta;
      }
    }
  }
}

/**
 * 处理所有路径段并收集路由信息
 * @param segments 路径段数组
 * @returns 处理结果，包含处理后的段、参数名和分析指标
 */
function processAllPathSegments(segments: string[]): {
  processedSegments: ProcessedSegment[];
  paramNames: string[];
  isIndex: boolean;
  isDynamic: boolean;
  isCatchAll: boolean;
  meta: RouteMetadata;
} {
  const processedSegments: ProcessedSegment[] = [];
  const results = {
    paramNames: [] as string[],
    isIndex: false,
    isDynamic: false,
    isCatchAll: false,
    meta: { params: {} } as RouteMetadata
  };

  // 处理每个路径段
  for (let i = 0; i < segments.length; i++) {
    const isLastSegment = i === segments.length - 1;
    const processed = processPathSegment(segments[i], isLastSegment, i);

    processedSegments.push(processed);
    updateSegmentAnalysis(processed, results);
  }

  return {
    processedSegments,
    ...results
  };
}

/**
 * 构建路由路径和名称
 * @param processedSegments 已处理的路径段数组
 * @param options 路由选项
 * @returns 路由路径和路由名称
 */
function buildRoutePathAndName(
  processedSegments: ProcessedSegment[],
  options: {
    includeParentInName: boolean;
    routeNameSeparator: string;
    keepIndexInPath: boolean;
  }
): { routePath: string; routeName: string } {
  const { includeParentInName, routeNameSeparator, keepIndexInPath } = options;

  // 构建路由路径
  const pathSegments = processedSegments
    .filter(
      segment =>
        segment.type !== PathSegmentType.Index ||
        (segment.type === PathSegmentType.Index && keepIndexInPath)
    )
    .map(segment => segment.pathSegment)
    .filter(Boolean);

  const routePath = pathSegments.length > 0 ? `/${pathSegments.join('/')}` : '/';

  // 构建路由名称
  let nameSegments = processedSegments.map(segment => segment.nameSegment);

  // 如果不包含父级路径，只使用最后一个非空名称段
  if (!includeParentInName && nameSegments.length > 1) {
    nameSegments = [nameSegments[nameSegments.length - 1]];
  }

  const routeName = nameSegments.filter(Boolean).join(routeNameSeparator);

  return {
    routePath,
    routeName
  };
}

/**
 * 创建最终的解析结果
 * @returns 解析结果
 */
function createParsedResult(options: {
  routePath: string;
  routeName: string;
  analysisResults: ReturnType<typeof processAllPathSegments>;
  filePath: string;
  rawPath: string;
}): ParsedPath {
  const { routePath, routeName, analysisResults, filePath, rawPath } = options;
  const { isIndex, isDynamic, isCatchAll, paramNames, meta } = analysisResults;

  // 添加额外的元数据
  meta.filePath = filePath;

  return {
    routePath,
    routeName,
    isIndex,
    isDynamic,
    isCatchAll,
    paramNames,
    rawPath,
    meta
  };
}

// ==================== 导出函数 ====================

/**
 * 解析文件路径，提取路由路径和名称
 * @param filePath 相对于pages目录的文件路径
 * @param options 解析选项
 * @returns 解析结果
 */
export function parsePath(filePath: string, options: ParsePathOptions = {}): ParsedPath {
  // 1. 提取和标准化选项
  const {
    keepExtension = false,
    toLowerCase = true,
    includeParentInName = true,
    routeNameSeparator = '-',
    keepIndexInPath = false
  } = options;

  // 2. 预处理路径，获取标准化的路径段
  const { segments, rawPath } = preprocessPath(filePath, keepExtension, toLowerCase);

  // 3. 处理所有路径段并收集路由信息
  const analysisResults = processAllPathSegments(segments);

  // 4. 构建路由路径和名称
  const { routePath, routeName } = buildRoutePathAndName(analysisResults.processedSegments, {
    includeParentInName,
    routeNameSeparator,
    keepIndexInPath
  });

  // 5. 创建最终的解析结果
  return createParsedResult({
    routePath,
    routeName,
    analysisResults,
    filePath,
    rawPath
  });
}

/**
 * 将页面文件路径转换为路由配置所需的数据
 * @param filePath 相对于pages目录的文件路径
 * @param rootDir 根目录路径
 * @param options 路径解析选项
 * @returns 路由配置数据
 */
export function parsePageFilePath(
  filePath: string,
  rootDir: string,
  options: ParsePathOptions = {}
): ParsedPath & { absolutePath: string } {
  // 获取基本的路由信息
  const parsed = parsePath(filePath, options);

  // 获取绝对路径
  const absolutePath = path.resolve(rootDir, filePath);

  return {
    ...parsed,
    absolutePath
  };
}

/**
 * 获取路由参数信息
 * @param routePath 路由路径
 * @returns 路由参数信息
 */
export function extractRouteParams(routePath: string): string[] {
  const params: string[] = [];
  let match;
  const regex = REGEXPS.ROUTE_PARAMS;

  // 重置正则表达式状态
  regex.lastIndex = 0;

  while ((match = regex.exec(routePath)) !== null) {
    params.push(match[1]);
  }

  return params;
}

/**
 * 检测路径是否包含动态参数
 * @param routePath 路由路径
 * @returns 是否包含动态参数
 */
export function hasParams(routePath: string): boolean {
  return REGEXPS.ROUTE_PARAMS.test(routePath);
}
