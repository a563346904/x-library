import type { RsbuildPlugin } from '@rsbuild/core';

import { generateRoutes } from '../core';
import { defaultOptions } from '../core/options';
import type { AutoRoutePluginOptions } from '../core/types';

/**
 * 自动路由插件
 * @returns Rsbuild 插件
 */

const plugins = (params: AutoRoutePluginOptions = defaultOptions): RsbuildPlugin => {
  return {
    name: 'auto-route-plugin',
    setup(api) {
      api.onBeforeBuild(() => {
        generateRoutes(params);
      });

      api.onBeforeStartDevServer(() => {
        generateRoutes(params);
      });
    }
  };
};

export default plugins;
