import { PathSegmentType } from './enums';

/**
 * 路由配置选项
 */
export interface RouteOptions {
  /**
   * 页面文件所在目录（相对于项目根目录）
   */
  pagesDir: string;

  /**
   * 要排除的文件路径模式
   */
  exclude?: string[];

  /**
   * 要包含的文件扩展名
   */
  extensions: string[];

  /**
   * 动态导入路由组件（用于懒加载）
   * @default 'async'
   */
  importMode?: 'sync' | 'async';

  /**
   * 路由组件命名规则
   */
  routeNameGenerator?: (filepath: string) => string;

  /**
   * 是否启用布局系统
   * @default true
   */
  enableLayouts?: boolean;

  /**
   * 布局目录（相对于项目根目录）
   * @default 'src/layouts'
   */
  layoutsDir?: string;

  /**
   * 默认布局名称
   * @default 'default'
   */
  defaultLayout?: string;

  /**
   * 自定义路由元数据处理函数
   */
  extendRoute?: (route: RouteDefinition) => RouteDefinition | null | undefined | void;

  /**
   * 虚拟模块名称前缀
   * @default 'virtual:'
   */
  virtualModule: string;
}

/**
 * 路由元数据
 */
export interface RouteMetadata {
  /**
   * 文件路径
   */
  filePath?: string;

  /**
   * 路由参数信息
   */
  params: Record<string, unknown>;

  /**
   * 其他元数据
   */
  [key: string]: unknown;
}

/**
 * 路由定义配置
 */
export interface RouteDefinition {
  /**
   * 路由路径
   */
  path: string;

  /**
   * 路由名称
   */
  name?: string;

  /**
   * 路由组件或组件导入函数
   */
  component: string | (() => Promise<any>);

  /**
   * 子路由
   */
  children?: RouteDefinition[];

  /**
   * 路由元数据
   */
  meta?: Record<string, any>;

  /**
   * 路由属性
   */
  props?: boolean | Record<string, any> | ((route: any) => Record<string, any>);

  /**
   * 重定向
   */
  redirect?: string | Record<string, any> | ((to: any) => string | Record<string, any>);

  /**
   * 别名
   */
  alias?: string | string[];

  /**
   * 路由进入前守卫
   */
  beforeEnter?: (to: any, from: any, next: any) => void;
}

/**
 * 从页面文件中提取的路由信息
 */
export interface RouteInfo {
  /**
   * 相对路径（相对于pagesDir）
   */
  relativePath: string;

  /**
   * 绝对路径
   */
  absolutePath: string;

  /**
   * 路由路径
   */
  routePath: string;

  /**
   * 路由名称
   */
  routeName: string;

  /**
   * 组件导入语句
   */
  componentImport: string;

  /**
   * 组件元数据
   */
  meta?: Record<string, any>;
}

/**
 * 布局系统选项
 */
export interface LayoutOptions {
  /**
   * 布局目录（相对于项目根目录）
   */
  layoutsDir: string;

  /**
   * 默认布局文件名
   */
  defaultLayout: string;

  /**
   * 处理布局文件命名的方法
   */
  getLayoutName?: (layoutFile: string) => string;

  /**
   * 是否在路由meta中添加布局信息
   * @default true
   */
  addLayoutToMeta?: boolean;
}

/**
 * 布局信息
 */
export interface LayoutInfo {
  /**
   * 布局名称
   */
  name: string;

  /**
   * 布局组件路径
   */
  componentPath: string;

  /**
   * 布局组件导入语句
   */
  componentImport: string;
}

/**
 * 路径解析选项
 */
export interface ParsePathOptions {
  /**
   * 是否保留文件扩展名
   * @default false
   */
  keepExtension?: boolean;

  /**
   * 是否将路径转换为小写
   * @default true
   */
  toLowerCase?: boolean;

  /**
   * 是否在路由名称中包含父级路径
   * @default true
   */
  includeParentInName?: boolean;

  /**
   * 自定义路由名称分隔符
   * @default '-'
   */
  routeNameSeparator?: string;

  /**
   * 是否在路径中保留索引文件名称
   * (如果为false，pages/users/index.vue将变为/users而非/users/index)
   * @default false
   */
  keepIndexInPath?: boolean;
}

/**
 * 解析结果
 */
export interface ParsedPath {
  /**
   * 路由路径 (如 /users/:id)
   */
  routePath: string;

  /**
   * 路由名称 (如 users-id)
   */
  routeName: string;

  /**
   * 是否是索引路由
   */
  isIndex: boolean;

  /**
   * 是否是动态路由
   */
  isDynamic: boolean;

  /**
   * 是否是捕获所有路由
   */
  isCatchAll: boolean;

  /**
   * 路由参数名称数组
   */
  paramNames: string[];

  /**
   * 文件原始路径 (不含扩展名)
   */
  rawPath: string;

  /**
   * 路由元数据
   */
  meta: RouteMetadata;
}

/**
 * 路径段处理结果
 */
export interface ProcessedSegment {
  /**
   * 路径段类型
   */
  type: PathSegmentType;

  /**
   * 处理后的路径片段
   */
  pathSegment: string;

  /**
   * 用于生成路由名称的片段
   */
  nameSegment: string;

  /**
   * 如果是参数，则包含参数名
   */
  paramName?: string;

  /**
   * 元数据
   */
  meta?: Record<string, unknown>;
}
