import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

interface ValidTestCase {
  code: string;
  filename?: string;
}

interface InvalidTestCase extends ValidTestCase {
  errors:
    | number
    | Array<{
        message?: string;
        line?: number;
        column?: number;
      }>;
}

interface RuleTestConfig {
  name: string;
  rule: any;
  valid: ValidTestCase[];
  invalid: InvalidTestCase[];
}

/**
 * 简化版的 ESLint 规则测试工具，兼容 ESLint 9 扁平配置
 */
export async function testRule(config: RuleTestConfig) {
  const { name, rule, valid, invalid } = config;

  describe(`规则: ${name}`, () => {
    // 测试有效的用例
    describe('有效用例', () => {
      valid.forEach((testCase, index) => {
        it(`用例 #${index + 1}: ${testCase.code.slice(0, 40)}${testCase.code.length > 40 ? '...' : ''}`, async () => {
          // 创建唯一的插件名称，避免冲突
          const pluginName = `test-plugin-${Date.now()}`;
          const ruleId = `${pluginName}/${name}`;

          const eslint = new ESLint({
            // ESLint 9 使用扁平配置
            overrideConfig: {
              linterOptions: {
                reportUnusedDisableDirectives: false
              },
              languageOptions: {
                ecmaVersion: 2020,
                sourceType: 'module'
              },
              // 注册插件和规则
              plugins: {
                [pluginName]: {
                  rules: {
                    [name]: rule
                  }
                }
              },
              // 启用规则
              rules: {
                [ruleId]: 'error'
              }
            },
            // 必须启用这个选项才能允许内联插件
            allowInlineConfig: true
          });

          const results = await eslint.lintText(testCase.code, {
            filePath: testCase.filename || 'test.js'
          });

          // 验证没有错误
          expect(results[0].messages).toHaveLength(0);
        });
      });
    });

    // 测试无效的用例
    describe('无效用例', () => {
      invalid.forEach((testCase, index) => {
        it(`用例 #${index + 1}: ${testCase.code.slice(0, 40)}${testCase.code.length > 40 ? '...' : ''}`, async () => {
          // 创建唯一的插件名称，避免冲突
          const pluginName = `test-plugin-${Date.now()}`;
          const ruleId = `${pluginName}/${name}`;

          const eslint = new ESLint({
            // ESLint 9 使用扁平配置
            overrideConfig: {
              linterOptions: {
                reportUnusedDisableDirectives: false
              },
              languageOptions: {
                ecmaVersion: 2020,
                sourceType: 'module'
              },
              // 注册插件和规则
              plugins: {
                [pluginName]: {
                  rules: {
                    [name]: rule
                  }
                }
              },
              // 启用规则
              rules: {
                [ruleId]: 'error'
              }
            },
            // 必须启用这个选项才能允许内联插件
            allowInlineConfig: true
          });

          const results = await eslint.lintText(testCase.code, {
            filePath: testCase.filename || 'test.js'
          });

          const messages = results[0].messages;
          const expectedErrorCount =
            typeof testCase.errors === 'number' ? testCase.errors : testCase.errors.length;

          expect(messages).toHaveLength(expectedErrorCount);

          // 如果错误详情是数组，则验证每个错误
          if (Array.isArray(testCase.errors) && messages.length === testCase.errors.length) {
            testCase.errors.forEach((error, errorIndex) => {
              if (error.message) {
                expect(messages[errorIndex].message).toContain(error.message);
              }
              if (error.line) {
                expect(messages[errorIndex].line).toBe(error.line);
              }
              if (error.column) {
                expect(messages[errorIndex].column).toBe(error.column);
              }
            });
          }
        });
      });
    });
  });
}
