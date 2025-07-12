/**
 * 虚拟模块管理工具
 * 负责创建和更新 RSpack 虚拟模块
 */

import VirtualModulePlugin from 'rspack-plugin-virtual-module';

/**
 * 创建路由虚拟模块
 * 初始化一个包含路由代码的虚拟模块
 *
 * @param virtualModuleKey - 虚拟模块的标识符（如 '~virtual-routes'）
 * @param routesCode - 路由代码内容
 * @returns 虚拟模块插件实例
 */
export function createRoutesVirtualModule(
  virtualModuleKey: string,
  routesCode: string
): VirtualModulePlugin {
  return new VirtualModulePlugin({
    [virtualModuleKey]: routesCode
  });
}

/**
 * 更新路由虚拟模块内容
 * 用于热更新时动态更新虚拟模块的内容
 *
 * @param virtualModuleKey - 虚拟模块的标识符
 * @param plugin - 虚拟模块插件实例
 * @param routesCode - 新的路由代码内容
 */
export function updateRoutesVirtualModule(
  virtualModuleKey: string,
  plugin: VirtualModulePlugin,
  routesCode: string
): void {
  plugin.writeModule(virtualModuleKey, routesCode);
}
