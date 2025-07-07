export interface XLibraryConfig {
  name: string;
  version: string;
}

export class XLibrary {
  private config: XLibraryConfig;

  constructor(config: XLibraryConfig) {
    this.config = config;
  }

  public getName(): string {
    return this.config.name;
  }

  public getVersion(): string {
    return this.config.version;
  }

  public greet(message?: string): string {
    const greeting = message || 'Hello from X Library!';
    return `${greeting} (${this.config.name} v${this.config.version})`;
  }
}

export const createXLibrary = (config: XLibraryConfig): XLibrary => {
  return new XLibrary(config);
};

// 导出命名空间功能
export * from './namespace';

export default XLibrary;
