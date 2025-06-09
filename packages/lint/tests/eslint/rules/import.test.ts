import { importRules } from '../../../src/eslint/rules/import';

describe('Import 规则测试', () => {
  // 测试规则存在
  it('应该导出 importRules', () => {
    expect(importRules).toBeDefined();
    expect(Object.keys(importRules).length).toBeGreaterThan(0);
  });

  // 测试特定规则配置
  it('应该正确配置导入顺序规则', () => {
    expect(importRules['import/order']).toBeDefined();
  });
});
