import type { RouteInfo } from './types';

/**
 * 路由状态管理器
 */
class RouteStateManager {
  private routes = new Map<string, RouteInfo>();

  /**
   * 设置路由
   * @param routes 路由信息
   */
  setRoutes(routes: RouteInfo[]) {
    routes.forEach(route => {
      this.routes.set(route.relativePath, route);
    });
  }
}

// 全局路由状态管理器实例
export const routeState = new RouteStateManager();
