// packages/core/src/__tests__/namespace.test.ts
import { createNamespace, NamespaceManager } from '../namespace';

describe('NamespaceManager', () => {
  it('should use default prefix "X"', () => {
    const ns = createNamespace();
    expect(ns.getName('Layout')).toBe('XLayout');
  });

  it('should handle custom prefix', () => {
    const ns = createNamespace({ prefix: 'App' });
    expect(ns.getName('Layout')).toBe('AppLayout');
  });

  it('should handle empty prefix', () => {
    const ns = createNamespace({ prefix: '' });
    expect(ns.getName('Layout')).toBe('Layout');
  });

  it('should handle separator', () => {
    const ns = createNamespace({ prefix: 'X', separator: '-' });
    expect(ns.getName('Layout')).toBe('X-Layout');
  });

  it('should handle pascalCase option', () => {
    const ns = createNamespace({ prefix: 'app', pascalCase: true });
    expect(ns.getName('Layout')).toBe('AppLayout');

    const ns2 = createNamespace({ prefix: 'app', pascalCase: false });
    expect(ns2.getName('Layout')).toBe('appLayout');
  });

  it('should create name map correctly', () => {
    const ns = createNamespace({ prefix: 'My' });
    const map = ns.createNameMap(['Layout', 'LayoutProvider']);
    expect(map).toEqual({
      Layout: 'MyLayout',
      LayoutProvider: 'MyLayoutProvider'
    });
  });

  it('should get config correctly', () => {
    const ns = createNamespace({ prefix: 'Test', separator: '_' });
    expect(ns.getConfig()).toEqual({
      prefix: 'Test',
      separator: '_',
      pascalCase: true
    });
  });

  it('should handle component factory', () => {
    const ns = createNamespace({ prefix: 'App' });
    const mockComponent = (name: string) => ({ name, type: 'component' });

    const component = ns.createComponentFactory(mockComponent, 'Layout');
    expect(component).toEqual({
      name: 'AppLayout',
      type: 'component'
    });
  });
});
