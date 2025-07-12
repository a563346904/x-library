import type { RouteOptions } from '@x-library/vue-router-shared';
import {
  generateLayoutsExport,
  generateLayoutsModule,
  generateVirtualModuleContent,
  mergeOptions,
  scanLayouts,
  unpluginDefinePageMeta
} from '@x-library/vue-router-shared';
import { watch } from 'chokidar';
import { join } from 'pathe';
import type { Plugin, ResolvedConfig } from 'vite';

const VIRTUAL_MODULE_ID = '~virtual-routes';
const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`;

const VIRTUAL_LAYOUTS_MODULE_ID = '~virtual-layouts';
const RESOLVED_VIRTUAL_LAYOUTS_MODULE_ID = `\0${VIRTUAL_LAYOUTS_MODULE_ID}`;

const VIRTUAL_LAYOUTS_EXPORT_MODULE_ID = '~virtual-layouts-export';
const RESOLVED_VIRTUAL_LAYOUTS_EXPORT_MODULE_ID = `\0${VIRTUAL_LAYOUTS_EXPORT_MODULE_ID}`;

const VIRTUAL_MACROS_MODULE_ID = '~virtual-macros';
const RESOLVED_VIRTUAL_MACROS_MODULE_ID = `\0${VIRTUAL_MACROS_MODULE_ID}`;

// 辅助函数：生成布局内容
async function generateLayoutsContent(options: RouteOptions): Promise<{
  layoutsModuleContent: string;
  layoutsExportContent: string;
}> {
  if (!options.enableLayouts || !options.layoutsDir) {
    return {
      layoutsModuleContent: '',
      layoutsExportContent: ''
    };
  }

  const layouts = await scanLayouts({
    layoutsDir: options.layoutsDir,
    exclude: options.exclude,
    extensions: options.extensions
  });

  return {
    layoutsModuleContent: generateLayoutsModule(layouts),
    layoutsExportContent: generateLayoutsExport(options)
  };
}

// 辅助函数：更新模块状态
async function updateModuleState(
  options: RouteOptions,
  filePath?: string
): Promise<{
  virtualModuleContent: string;
  layoutsModuleContent: string;
  layoutsExportContent: string;
}> {
  const virtualModuleContent = await generateVirtualModuleContent(options);

  let layoutsModuleContent = '';
  let layoutsExportContent = '';

  // 只在布局相关文件变化或初始化时重新生成布局
  if (
    !filePath ||
    (options.enableLayouts && options.layoutsDir && filePath.includes(options.layoutsDir))
  ) {
    const layoutsContent = await generateLayoutsContent(options);
    layoutsModuleContent = layoutsContent.layoutsModuleContent;
    layoutsExportContent = layoutsContent.layoutsExportContent;
  }

  return {
    virtualModuleContent,
    layoutsModuleContent,
    layoutsExportContent
  };
}

// 辅助函数：处理文件变化
async function handleFileChange(
  event: string,
  filePath: string,
  options: RouteOptions,
  config: ResolvedConfig,
  state: {
    virtualModuleContent: string;
    layoutsModuleContent: string;
    layoutsExportContent: string;
  }
): Promise<void> {
  console.log(`[vue-router] 文件变化: ${event} ${filePath}`);

  // 更新模块状态
  const updatedState = await updateModuleState(options, filePath);
  Object.assign(state, updatedState);

  // 触发 HMR
  invalidateModules(config, options);
  const devServer = config.server;
  if (devServer && 'ws' in devServer && devServer.ws) {
    (devServer.ws as any).send({
      type: 'full-reload'
    });
  }
}

// 辅助函数：使模块失效
function invalidateModules(config: ResolvedConfig, options: RouteOptions): void {
  const devServer = config.server;
  if (!devServer || !('moduleGraph' in devServer) || !devServer.moduleGraph) return;

  const moduleGraph = devServer.moduleGraph as any;

  const module = moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID);
  if (module) {
    moduleGraph.invalidateModule(module);
  }

  if (!options.enableLayouts) return;

  const layoutModule = moduleGraph.getModuleById(RESOLVED_VIRTUAL_LAYOUTS_MODULE_ID);
  if (layoutModule) {
    moduleGraph.invalidateModule(layoutModule);
  }

  const layoutExportModule = moduleGraph.getModuleById(RESOLVED_VIRTUAL_LAYOUTS_EXPORT_MODULE_ID);
  if (layoutExportModule) {
    moduleGraph.invalidateModule(layoutExportModule);
  }
}

// 辅助函数：创建Vite插件
function createVitePlugin(
  options: RouteOptions,
  moduleState: {
    config: ResolvedConfig;
    watcher: ReturnType<typeof watch> | null;
    virtualModuleContent: string;
    layoutsModuleContent: string;
    layoutsExportContent: string;
  },
  initializeModules: () => Promise<void>,
  setupFileWatcher: () => void
): Plugin {
  return {
    name: 'vite-plugin-auto-routes',

    config() {
      return {
        optimizeDeps: {
          include: [
            '@x-library/core',
            '@x-library/vue-router-shared',
            '@x-library/vue-router-shared/layouts',
            '@x-library/vue-router-shared/macros'
          ]
        },
        ssr: {
          noExternal: ['@x-library/vue-router-shared', '@x-library/core']
        }
      };
    },

    configResolved(resolvedConfig) {
      moduleState.config = resolvedConfig;
    },

    async buildStart() {
      await initializeModules();
      setupFileWatcher();
    },

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID || id === options.virtualModule) {
        return RESOLVED_VIRTUAL_MODULE_ID;
      }
      if (id === VIRTUAL_LAYOUTS_MODULE_ID) {
        return RESOLVED_VIRTUAL_LAYOUTS_MODULE_ID;
      }
      if (id === VIRTUAL_LAYOUTS_EXPORT_MODULE_ID) {
        return RESOLVED_VIRTUAL_LAYOUTS_EXPORT_MODULE_ID;
      }
      if (id === VIRTUAL_MACROS_MODULE_ID && options.enableLayouts) {
        return RESOLVED_VIRTUAL_MACROS_MODULE_ID;
      }
    },

    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        return moduleState.virtualModuleContent;
      }
      if (id === RESOLVED_VIRTUAL_LAYOUTS_MODULE_ID) {
        return moduleState.layoutsModuleContent;
      }
      if (id === RESOLVED_VIRTUAL_LAYOUTS_EXPORT_MODULE_ID) {
        return moduleState.layoutsExportContent;
      }
      if (id === RESOLVED_VIRTUAL_MACROS_MODULE_ID && options.enableLayouts) {
        return `export { definePageMeta } from '@x-library/vue-router-shared/macros';`;
      }
    },

    closeBundle() {
      moduleState.watcher?.close();
    }
  };
}

export function viteAutoRoutes(userOptions: Partial<RouteOptions> = {}): Plugin[] {
  const options: RouteOptions = mergeOptions(userOptions);

  let config: ResolvedConfig;
  let watcher: ReturnType<typeof watch> | null = null;
  let virtualModuleContent: string = '';
  let layoutsModuleContent: string = '';
  let layoutsExportContent: string = '';

  const moduleState = {
    get config() {
      return config;
    },
    set config(value) {
      config = value;
    },
    get watcher() {
      return watcher;
    },
    set watcher(value) {
      watcher = value;
    },
    get virtualModuleContent() {
      return virtualModuleContent;
    },
    get layoutsModuleContent() {
      return layoutsModuleContent;
    },
    get layoutsExportContent() {
      return layoutsExportContent;
    }
  };

  async function initializeModules(): Promise<void> {
    const state = await updateModuleState(options);
    virtualModuleContent = state.virtualModuleContent;
    layoutsModuleContent = state.layoutsModuleContent;
    layoutsExportContent = state.layoutsExportContent;
  }

  function setupFileWatcher(): void {
    if (config.command !== 'serve') return;

    const watchPaths = [join(options.pagesDir, '**/*')];
    if (options.enableLayouts && options.layoutsDir) {
      watchPaths.push(join(options.layoutsDir, '**/*'));
    }

    watcher = watch(watchPaths, {
      ignoreInitial: true,
      ignored: options.exclude
    });

    watcher.on('all', async (event, filePath) => {
      const state = {
        virtualModuleContent,
        layoutsModuleContent,
        layoutsExportContent
      };

      await handleFileChange(event, filePath, options, config, state);

      const updatedState = await updateModuleState(options, filePath);
      virtualModuleContent = updatedState.virtualModuleContent;
      if (updatedState.layoutsModuleContent) {
        layoutsModuleContent = updatedState.layoutsModuleContent;
      }
      if (updatedState.layoutsExportContent) {
        layoutsExportContent = updatedState.layoutsExportContent;
      }
    });

    console.log('[vue-router] 文件监听已设置');
  }

  const vitePlugin = createVitePlugin(options, moduleState, initializeModules, setupFileWatcher);
  const plugins: Plugin[] = [vitePlugin];

  if (options.enableLayouts) {
    plugins.push(unpluginDefinePageMeta.vite() as Plugin);
  }

  return plugins;
}
