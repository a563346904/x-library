/**
 * ESLint 规则模块统一导出
 */

export { importRules } from './import';
export { qualityRules } from './quality';
export { securityRules } from './security';
export { errorHandlingRules } from './error-handling';
export { namingRules } from './naming';
export { performanceRules } from './performance';
export { maintainabilityRules } from './maintainability';
export { typescriptRules } from './typescript';
export { prettierRules } from './prettier';
export {
  vueBaseRules,
  vueNamingRules,
  vueCompositionRules,
  vueBestPracticeRules,
  allVueRules
} from './vue';

// 组合的 JavaScript/TypeScript 规则
import { errorHandlingRules } from './error-handling';
import { importRules } from './import';
import { maintainabilityRules } from './maintainability';
import { namingRules } from './naming';
import { performanceRules } from './performance';
import { prettierRules } from './prettier';
import { qualityRules } from './quality';
import { securityRules } from './security';
import { typescriptRules } from './typescript';

export const allJavaScriptRules = {
  ...importRules,
  ...qualityRules,
  ...securityRules,
  ...errorHandlingRules,
  ...namingRules,
  ...performanceRules,
  ...maintainabilityRules,
  ...typescriptRules,
  ...prettierRules
};
