import VirtualModulePlugin from 'rspack-plugin-virtual-module';

/**
 * 创建路由虚拟模块
 * @param routesCode 路由代码内容
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
 * @param plugin 虚拟模块插件实例
 * @param routesCode 新的路由代码内容
 */
export function updateRoutesVirtualModule(
  virtualModuleKey: string,
  plugin: VirtualModulePlugin,
  routesCode: string
): void {
  plugin.writeModule(virtualModuleKey, routesCode);
}
