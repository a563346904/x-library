import { glob } from 'fast-glob';
import { resolve } from 'pathe';

export interface LayoutFile {
  /** 布局名称 */
  name: string;
  /** 布局文件路径 */
  filepath: string;
  /** 组件导入路径 */
  component: string;
}

export interface LayoutScanOptions {
  /** 布局目录 */
  layoutsDir: string;
  /** 排除的文件模式 */
  exclude?: string[];
  /** 文件扩展名 */
  extensions?: string[];
}

/**
 * 扫描布局文件
 */
export async function scanLayouts(options: LayoutScanOptions): Promise<LayoutFile[]> {
  const { layoutsDir, exclude = [], extensions = ['vue'] } = options;

  // 构建 glob 模式
  const patterns = extensions.map(ext => `**/*.${ext}`);

  // 扫描布局文件
  const files = await glob(patterns, {
    cwd: layoutsDir,
    ignore: exclude,
    onlyFiles: true,
    absolute: false
  });

  // 解析布局文件
  const layouts: LayoutFile[] = [];
  for (const file of files) {
    const layout = parseLayout(file, layoutsDir);
    if (layout) {
      layouts.push(layout);
    }
  }

  return layouts;
}

/**
 * 解析布局文件
 */
function parseLayout(filepath: string, layoutsDir: string): LayoutFile | null {
  const filename = filepath.split('/').pop()!;
  const nameWithoutExt = filename.replace(/\.\w+$/, '');

  // 生成布局名称
  let name: string;
  if (nameWithoutExt === 'default') {
    name = 'default';
  } else {
    // 移除文件路径中的目录部分，只保留文件名
    const parts = filepath.split('/');
    const fileName = parts.pop()!.replace(/\.\w+$/, '');

    // 如果有目录层级，使用目录名作为前缀
    if (parts.length > 0) {
      name = [...parts, fileName].join('-');
    } else {
      name = fileName;
    }
  }

  const absolutePath = resolve(layoutsDir, filepath);

  return {
    name,
    filepath: absolutePath,
    component: `@/layouts/${filepath.replace(/\\/g, '/')}`
  };
}
