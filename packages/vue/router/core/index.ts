import { resolve } from 'path';

import { generateRouteInfo } from './parser';
import { scanViewsDirectory } from './scan';
import type { AutoRoutePluginOptions } from './types';
import { saveGeneratedRoutes } from './writer';

export function generateRoutes(options: AutoRoutePluginOptions) {
  const { entry } = options;
  const viewsPath = resolve(process.cwd(), entry);
  const buildDir = resolve(process.cwd(), '.x-build');

  // 1. Scan all view files
  const files = scanViewsDirectory(viewsPath, options);

  // 2. Parse file paths into structured route info
  const routes = files.map(file => generateRouteInfo(file, options));

  // 3. Generate route code and write to file
  saveGeneratedRoutes(buildDir, routes, options);
}

export * from './types';
