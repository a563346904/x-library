// packages/core/src/namespace.ts

export interface NamespaceOptions {
  /** 命名空间前缀，默认 'X' */
  prefix?: string;
  /** 分隔符，默认为空字符串 */
  separator?: string;
  /** 是否将前缀转换为 PascalCase，默认 true */
  pascalCase?: boolean;
}

/**
 * 默认的命名空间配置
 */
export const defaultNamespaceOptions: Required<NamespaceOptions> = {
  prefix: 'X',
  separator: '',
  pascalCase: true
};

export class NamespaceManager {
  private prefix: string;
  private separator: string;
  private pascalCase: boolean;

  constructor(options: NamespaceOptions = {}) {
    const mergedOptions = { ...defaultNamespaceOptions, ...options };
    this.prefix = options.prefix !== undefined ? options.prefix : mergedOptions.prefix;
    this.separator = options.separator !== undefined ? options.separator : mergedOptions.separator;
    this.pascalCase = mergedOptions.pascalCase;
  }

  /**
   * 为组件名添加命名空间前缀
   * @example
   * namespace.getName('Layout') // 'XLayout'
   * namespace.getName('LayoutProvider') // 'XLayoutProvider'
   */
  getName(baseName: string): string {
    if (!this.prefix) {
      return baseName;
    }

    const prefix = this.pascalCase ? this.toPascalCase(this.prefix) : this.prefix;
    return `${prefix}${this.separator}${baseName}`;
  }

  /**
   * 创建一个组件工厂，自动应用命名空间
   */
  createComponentFactory<T extends { name?: string }>(
    createComponent: (name: string) => T,
    baseName: string
  ): T {
    const namespacedName = this.getName(baseName);
    return createComponent(namespacedName);
  }

  /**
   * 批量生成带命名空间的组件名映射
   */
  createNameMap<K extends string>(baseNames: K[]): Record<K, string> {
    const map = {} as Record<K, string>;
    baseNames.forEach(baseName => {
      map[baseName] = this.getName(baseName);
    });
    return map;
  }

  /**
   * 获取当前配置
   */
  getConfig(): Required<NamespaceOptions> {
    return {
      prefix: this.prefix,
      separator: this.separator,
      pascalCase: this.pascalCase
    };
  }

  private toPascalCase(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}

/**
 * 创建命名空间管理器的工厂函数
 */
export function createNamespace(options?: NamespaceOptions): NamespaceManager {
  const mergedOptions = { ...defaultNamespaceOptions, ...options };
  return new NamespaceManager(mergedOptions);
}

/**
 * 默认命名空间实例
 */
export const defaultNamespace = createNamespace();
