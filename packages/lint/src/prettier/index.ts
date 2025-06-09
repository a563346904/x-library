import { default as defaultPrettierConfig } from './config';
import type { PrettierConfig } from './types';

export type { PrettierConfig } from './types';

export const prettierConfig = (options: PrettierConfig = {}): PrettierConfig => {
  return {
    ...defaultPrettierConfig,
    ...options
  };
};
