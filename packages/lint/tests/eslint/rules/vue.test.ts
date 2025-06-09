import { describe, expect, it } from 'vitest';

import * as vueRules from '../../../src/eslint/rules/vue';

describe('Vue ESLint 规则', () => {
  // 测试规则导出
  it('应该导出所有 Vue 规则组', () => {
    expect(vueRules.vueBaseRules).toBeDefined();
    expect(vueRules.vueNamingRules).toBeDefined();
    expect(vueRules.vueCompositionRules).toBeDefined();
    expect(vueRules.vueBestPracticeRules).toBeDefined();
    expect(vueRules.allVueRules).toBeDefined();
  });

  // 测试规则内容
  it('allVueRules 应该包含所有规则组的规则', () => {
    const allRuleKeys = Object.keys(vueRules.allVueRules);

    // 检查 vueBaseRules 中的所有规则是否都在 allVueRules 中
    Object.keys(vueRules.vueBaseRules).forEach(rule => {
      expect(allRuleKeys).toContain(rule);
    });

    // 检查 vueNamingRules 中的所有规则是否都在 allVueRules 中
    Object.keys(vueRules.vueNamingRules).forEach(rule => {
      expect(allRuleKeys).toContain(rule);
    });

    // 检查 vueCompositionRules 中的所有规则是否都在 allVueRules 中
    Object.keys(vueRules.vueCompositionRules).forEach(rule => {
      expect(allRuleKeys).toContain(rule);
    });

    // 检查 vueBestPracticeRules 中的所有规则是否都在 allVueRules 中
    Object.keys(vueRules.vueBestPracticeRules).forEach(rule => {
      expect(allRuleKeys).toContain(rule);
    });
  });

  // 测试特定规则配置
  it('应该正确配置 Vue 命名规则', () => {
    expect(vueRules.vueNamingRules['vue/attribute-hyphenation']).toEqual(['error', 'always']);
    expect(vueRules.vueNamingRules['vue/custom-event-name-casing']).toEqual([
      'error',
      'kebab-case'
    ]);
    expect(vueRules.vueNamingRules['vue/prop-name-casing']).toEqual(['error', 'camelCase']);
  });

  // 测试 Composition API 规则配置
  it('应该正确配置 Composition API 规则', () => {
    expect(vueRules.vueCompositionRules['vue/define-props-declaration']).toEqual([
      'error',
      'type-based'
    ]);
    expect(vueRules.vueCompositionRules['vue/define-emits-declaration']).toEqual([
      'error',
      'type-literal'
    ]);
    expect(vueRules.vueCompositionRules['vue/no-boolean-default']).toEqual([
      'error',
      'default-false'
    ]);
  });
});
