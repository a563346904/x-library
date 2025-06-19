import { execSync } from 'child_process';
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';

import { generateRouteCode } from './generator';
import type { AutoRoutePluginOptions, RouteInfo } from './types';

function formatGeneratedCode(filePath: string): void {
  try {
    // 优先使用 ESLint 格式化
    execSync(`npx eslint "${filePath}" --fix`, {
      cwd: process.cwd(),
      stdio: 'pipe' // 隐藏输出，避免干扰
    });
  } catch {
    // 如果 ESLint 不可用或失败，尝试使用 Prettier
    try {
      execSync(`npx prettier --write "${filePath}"`, {
        cwd: process.cwd(),
        stdio: 'pipe'
      });
    } catch {
      // 静默失败，避免过多输出
    }
  }
}

export function saveGeneratedRoutes(
  buildDir: string,
  routes: RouteInfo[],
  params: AutoRoutePluginOptions
): void {
  const routeCode = generateRouteCode(routes, params);

  const routeFilePath = resolve(buildDir, `routes.${params.mode}`);
  // 确保目录存在
  mkdirSync(dirname(routeFilePath), { recursive: true });
  writeFileSync(routeFilePath, routeCode, 'utf-8');

  formatGeneratedCode(routeFilePath);
}
