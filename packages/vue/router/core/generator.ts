import type { AutoRoutePluginOptions, NestedRouteInfo, RouteInfo } from './types';

function buildRouteTree(routes: RouteInfo[], extensions: string[]): NestedRouteInfo[] {
  const nodes: NestedRouteInfo[] = routes.map(r => ({ ...r, children: [] }));
  const routeMap = new Map<string, NestedRouteInfo>();

  for (const node of nodes) {
    const key = node.relativePath.replace(
      new RegExp(`(${extensions.join('|').replace(/\./g, '\\.')})$`),
      ''
    );
    routeMap.set(key, node);
  }

  const nestedNodes = new Set<NestedRouteInfo>();

  // Sort by path length, descending, to process children before parents
  const sortedNodes = [...nodes].sort((a, b) => b.relativePath.length - a.relativePath.length);

  for (const node of sortedNodes) {
    const key = node.relativePath.replace(
      new RegExp(`(${extensions.join('|').replace(/\./g, '\\.')})$`),
      ''
    );

    const parentDir = key.substring(0, key.lastIndexOf('/'));
    if (!parentDir) {
      continue; // No parent directory, so it's a top-level route
    }

    // A parent can be a layout file (e.g., users.vue) or an index file (e.g., users/index.vue)
    const parentNode = routeMap.get(parentDir) ?? routeMap.get(`${parentDir}/index`);

    if (parentNode && parentNode !== node) {
      parentNode.children.unshift(node); // unshift to keep a more natural order (index files first)
      nestedNodes.add(node);
    }
  }

  return nodes.filter(node => !nestedNodes.has(node));
}

function collectImports(routes: NestedRouteInfo[]): string[] {
  const imports = new Set<string>();

  function traverse(nodes: NestedRouteInfo[]) {
    for (const node of nodes) {
      const importPath = node.meta.filePath.replace('/src/', '@/');
      imports.add(`import ${node.name} from '${importPath}'`);
      if (node.children.length > 0) {
        traverse(node.children);
      }
    }
  }

  traverse(routes);
  return Array.from(imports);
}

function generateRoutesDefinitionString(
  routes: NestedRouteInfo[],
  indent = '  ',
  parent: NestedRouteInfo | null = null
): string {
  const routeItems = routes.map(route => {
    let displayPath = route.path;

    if (parent) {
      const parentPath = parent.path;
      if (displayPath.startsWith(`${parentPath}/`)) {
        displayPath = displayPath.substring(parentPath.length + 1);
      } else if (displayPath === parentPath) {
        // This is an index route for a layout, e.g., /users is child of /users layout
        displayPath = '';
      }
    }

    let routeStr = `${indent}{
${indent}  path: '${displayPath}',
${indent}  name: '${route.name}',
${indent}  component: ${route.name},`;

    if (route.children.length > 0) {
      const childrenStr = generateRoutesDefinitionString(route.children, `${indent}  `, route);
      routeStr += `
${indent}  children: ${childrenStr},`;
    }

    routeStr += `\n${indent}}`;
    return routeStr;
  });

  return `[${routeItems.length > 0 ? `\n${routeItems.join(',\n')}\n` : ''}${indent.slice(2)}]`;
}

/**
 * @returns
 * import AboutPage from '@/views/about-page.vue'
 *
 * export const routes = [
 *  {
 *    path: '/about',
 *    name: 'About',
 *    component: AboutPage,
 *  }
 * ]
 *
 * export default routes
 */
export function generateRouteCode(routes: RouteInfo[], params: AutoRoutePluginOptions): string {
  const nestedRoutes = buildRouteTree(routes, params.extensions);
  const imports = collectImports(nestedRoutes);
  const routesDefinition = generateRoutesDefinitionString(nestedRoutes);

  const importsString = imports.join('\n');
  const defaultExportString = `export default routes;`;

  const header = `// 自动生成的路由文件
// 生成时间: ${new Date().toISOString()}
// 警告: 请勿手动修改此文件，它将被自动覆盖
`;

  if (params.mode === 'ts') {
    return `${header}
import type { RouteRecordRaw } from 'vue-router';
${importsString}

export const routes: RouteRecordRaw[] = ${routesDefinition};

${defaultExportString}
`;
  } else {
    // JavaScript mode with JSDoc for type-safety
    return `${header}
/** @typedef {import('vue-router').RouteRecordRaw} RouteRecordRaw */

${importsString}

/** @type {RouteRecordRaw[]} */
export const routes = ${routesDefinition};

${defaultExportString}
`;
  }
}
