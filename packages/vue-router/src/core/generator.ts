import * as path from 'path';

import { ImportMode } from '../enums';
import { RouteDefinition, RouteInfo, RouteOptions } from '../types';

import { parsePageFilePath } from './parser';

/**
 * 创建路由信息对象
 * @param filePath 相对于pages目录的文件路径
 * @param rootDir 项目根目录路径
 * @param options 路由选项
 * @returns 路由信息对象
 */
function createRouteInfo(filePath: string, rootDir: string, options: RouteOptions): RouteInfo {
  const { importMode = ImportMode.Async, pagesDir } = options;

  // 解析文件路径，获取路由信息
  const parsedPath = parsePageFilePath(filePath, rootDir, {
    includeParentInName: true,
    routeNameSeparator: '-',
    keepIndexInPath: false
  });

  // 组件导入路径（相对于项目根目录）
  const componentPath = path.join(pagesDir, filePath).replace(/\\/g, '/');

  // 转换成'@/'开头的别名路径, 'src/pages/home.vue' -> '@/pages/home.vue'
  const aliasPath = componentPath.replace(/^src\//, '@/');

  // 创建导入语句
  const componentImport =
    importMode === ImportMode.Async ? `() => import('${aliasPath}')` : `SYNC_IMPORT:${aliasPath}`;

  return {
    relativePath: filePath,
    absolutePath: parsedPath.absolutePath,
    routePath: parsedPath.routePath,
    routeName: parsedPath.routeName,
    componentImport,
    meta: {
      ...parsedPath.meta,
      // 添加其他元数据
      isDynamic: parsedPath.isDynamic,
      isIndex: parsedPath.isIndex,
      isCatchAll: parsedPath.isCatchAll
    }
  };
}

/**
 * 创建路由定义对象
 * @param routeInfo 路由信息
 * @returns 路由定义对象
 */
function createRouteDefinition(routeInfo: RouteInfo): RouteDefinition {
  return {
    path: routeInfo.routePath,
    name: routeInfo.routeName,
    component: routeInfo.componentImport,
    children: [],
    meta: routeInfo.meta
  };
}

/**
 * 将路由添加到路由树中
 * @param route 当前路由
 * @param segments 路径段
 * @param routeMap 路由映射
 * @param rootRoutes 顶级路由数组
 */
function addRouteToTree(
  route: RouteDefinition,
  segments: string[],
  routeMap: Record<string, RouteDefinition>,
  rootRoutes: RouteDefinition[]
): void {
  if (segments.length === 0 || (segments.length === 1 && segments[0] === '')) {
    // 顶级路由
    rootRoutes.push(route);
    routeMap['/'] = route;
  } else {
    // 尝试找到父路由
    const parentSegments = segments.slice(0, -1);
    const parentPath = `/${parentSegments.join('/')}`;

    const parentRoute = routeMap[parentPath];
    if (parentRoute) {
      // 将当前路由添加为父路由的子路由
      parentRoute.children = parentRoute.children || [];

      // 调整子路由路径（相对于父路由）
      const lastSegment = segments[segments.length - 1];
      route.path = lastSegment || '';

      parentRoute.children.push(route);
    } else {
      // 找不到父路由，当作顶级路由处理
      rootRoutes.push(route);
    }
  }

  // 添加到路由映射中
  routeMap[route.path] = route;
}

/**
 * 构建嵌套路由树
 * @param routes 扁平的路由信息数组
 * @returns 嵌套的路由定义数组
 */
function buildRouteTree(routes: RouteInfo[]): RouteDefinition[] {
  // 按路径段数排序，确保父级路由先被处理
  const sortedRoutes = [...routes].sort((a, b) => {
    const aSegments = a.routePath.split('/').filter(Boolean).length;
    const bSegments = b.routePath.split('/').filter(Boolean).length;
    return aSegments - bSegments;
  });

  // 路由映射，用于快速查找
  const routeMap: Record<string, RouteDefinition> = {};
  // 顶级路由数组
  const rootRoutes: RouteDefinition[] = [];

  // 遍历排序后的路由
  for (const routeInfo of sortedRoutes) {
    const route = createRouteDefinition(routeInfo);
    const segments = routeInfo.routePath.split('/').filter(Boolean);
    addRouteToTree(route, segments, routeMap, rootRoutes);
  }

  return rootRoutes;
}

/**
 * 应用用户自定义处理函数
 * @param routes 路由定义数组
 * @param extendRoute 用户自定义的路由扩展函数
 * @returns 处理后的路由定义数组
 */
function applyRouteExtension(
  routes: RouteDefinition[],
  extendRoute?: RouteOptions['extendRoute']
): RouteDefinition[] {
  if (!extendRoute) return routes;

  const processRoute = (route: RouteDefinition): RouteDefinition | null => {
    // 应用用户自定义处理
    const extendedRoute = extendRoute(route);

    // 如果返回null或undefined，表示要排除此路由
    if (extendedRoute === null || extendedRoute === undefined) {
      return null;
    }

    // 使用扩展后的路由或原始路由
    const currentRoute = extendedRoute || route;

    // 如果有子路由，递归处理
    if (currentRoute.children && currentRoute.children.length > 0) {
      const filteredChildren = currentRoute.children
        .map(processRoute)
        .filter((r): r is RouteDefinition => r !== null);

      currentRoute.children = filteredChildren;
    }

    return currentRoute;
  };

  // 处理所有顶级路由
  return routes.map(processRoute).filter((r): r is RouteDefinition => r !== null);
}

/**
 * 生成路由定义
 * @param files 页面文件路径数组 (相对于pagesDir)
 * @param options 路由选项
 * @returns 路由定义数组
 */
export async function generateRoutes(
  files: string[],
  options: RouteOptions
): Promise<RouteDefinition[]> {
  const { extendRoute } = options;

  // 获取项目根目录
  const rootDir = process.cwd();

  // 将文件路径转换为路由信息
  const routeInfoList = files.map(filePath => createRouteInfo(filePath, rootDir, options));

  // 构建路由树
  const routeTree = buildRouteTree(routeInfoList);

  // 应用用户自定义处理
  const finalRoutes = applyRouteExtension(routeTree, extendRoute);

  return finalRoutes;
}

/**
 * 生成路由代码字符串
 * @param routes 路由定义数组
 * @param importMode 导入模式
 * @returns JavaScript代码字符串
 */
export function generateRoutesCode(
  routes: RouteDefinition[],
  importMode: ImportMode = ImportMode.Async
): string {
  const imports: string[] = [];
  let componentNameCounter = 0;
  const componentNameMap = new Map<string, string>();

  // 递归处理路由，收集同步导入的组件
  function processRoutes(routes: RouteDefinition[]): RouteDefinition[] {
    return routes.map(route => {
      const processedRoute = { ...route };

      if (typeof processedRoute.component === 'string') {
        if (importMode === ImportMode.Sync && processedRoute.component.startsWith('SYNC_IMPORT:')) {
          // 同步导入模式：提取导入路径并生成组件名
          const importPath = processedRoute.component.replace('SYNC_IMPORT:', '');

          if (!componentNameMap.has(importPath)) {
            const componentName = `Component${componentNameCounter++}`;
            componentNameMap.set(importPath, componentName);
            imports.push(`import ${componentName} from '${importPath}';`);
            // 设置组件名称：如果组件没有名称，使用路由名称
            imports.push(
              `if (${componentName} && !${componentName}.name) { ${componentName}.name = '${processedRoute.name || 'UnnamedComponent'}'; }`
            );
          }

          processedRoute.component = componentNameMap.get(importPath)!;
        } else if (
          importMode === ImportMode.Async &&
          processedRoute.component.startsWith('() => import(')
        ) {
          // 异步导入模式：包装导入函数以设置组件名称
          const routeName = processedRoute.name || 'UnnamedComponent';
          // 使用特殊标记来标识异步导入函数，避免JSON.stringify破坏格式
          processedRoute.component = `__ASYNC_IMPORT_START__${processedRoute.component.substring(6)}__ROUTE_NAME__${routeName}__ASYNC_IMPORT_END__`;
        }
      }

      if (processedRoute.children && processedRoute.children.length > 0) {
        processedRoute.children = processRoutes(processedRoute.children);
      }

      return processedRoute;
    });
  }

  const processedRoutes = processRoutes(routes);

  const routesJson = JSON.stringify(processedRoutes, null, 2)
    // 替换组件导入函数字符串为实际函数
    .replace(/"component": "(.+?)"/g, '"component": $1')
    // 替换异步导入特殊标记为格式化的异步函数
    .replace(
      /"component": __ASYNC_IMPORT_START__(.+?)__ROUTE_NAME__(.+?)__ASYNC_IMPORT_END__/g,
      (match, importPart, routeName) => {
        return `"component": () => ${importPart}.then(module => {
    const component = module.default;
    if (component && !component.name) {
      component.name = '${routeName}';
    }
    return component;
  })`;
      }
    );

  // 组装最终代码
  const importsCode = imports.length > 0 ? `${imports.join('\n')}\n\n` : '';
  return `${importsCode}export default ${routesJson};`;
}
