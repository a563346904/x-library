import MagicString from 'magic-string';
import type { SourceMap } from 'magic-string';

/**
 * 处理 definePageMeta 调用，提取并移除
 */
function processDefinePageMeta(
  code: string,
  s: MagicString,
  id: string
): Record<string, unknown> | null {
  const definePageMetaRegex = /definePageMeta\s*\(\s*({[\s\S]*?})\s*\)/g;
  let pageMeta: Record<string, unknown> | null = null;

  let match;
  while ((match = definePageMetaRegex.exec(code)) !== null) {
    const [fullMatch, metaString] = match;
    const start = match.index;
    const end = start + fullMatch.length;

    try {
      // eslint-disable-next-line no-new-func
      pageMeta = new Function(`return ${metaString}`)();
      s.remove(start, end);
    } catch (error) {
      console.error(`Failed to parse definePageMeta in ${id}:`, error);
    }
  }

  return pageMeta;
}

/**
 * 注入页面元数据到代码中
 */
function injectPageMeta(code: string, s: MagicString, pageMeta: Record<string, unknown>): void {
  const scriptSetupMatch = code.match(/<script\s+setup[^>]*>/);
  if (scriptSetupMatch) {
    const scriptStart = scriptSetupMatch.index! + scriptSetupMatch[0].length;
    const injection = `
// Injected by definePageMeta transform
const __pageMeta = ${JSON.stringify(pageMeta)};
`;
    s.appendLeft(scriptStart, injection);
  }

  const exportDefaultMatch = code.match(/export\s+default\s+{/);
  if (exportDefaultMatch) {
    const exportStart = exportDefaultMatch.index! + exportDefaultMatch[0].length;
    s.appendLeft(exportStart, `\n  __pageMeta: ${JSON.stringify(pageMeta)},`);
  } else if (code.includes('<script setup>')) {
    const templateMatch = code.match(/<template>/);
    if (templateMatch) {
      const comment = `\n<!-- __pageMeta: ${JSON.stringify(pageMeta)} -->\n`;
      s.appendLeft(templateMatch.index!, comment);
    }
  }
}

/**
 * 转换 definePageMeta 宏
 * 提取页面元数据并注入到组件中
 */
export function transformDefinePageMeta(
  code: string,
  id: string
): { code: string; map?: SourceMap } | null {
  if (!id.endsWith('.vue') || !code.includes('definePageMeta')) {
    return null;
  }

  const s = new MagicString(code);
  const pageMeta = processDefinePageMeta(code, s, id);

  if (!pageMeta) {
    return null;
  }

  injectPageMeta(code, s, pageMeta);

  return {
    code: s.toString(),
    map: s.generateMap({ hires: true })
  };
}

/**
 * 从代码中提取 definePageMeta 的参数
 * 用于路由生成器
 */
export function extractPageMeta(code: string): Record<string, unknown> | null {
  if (!code.includes('definePageMeta')) {
    return null;
  }

  const definePageMetaRegex = /definePageMeta\s*\(\s*({[\s\S]*?})\s*\)/;
  const match = code.match(definePageMetaRegex);

  if (!match) {
    return null;
  }

  try {
    const metaString = match[1];
    // eslint-disable-next-line no-new-func
    return new Function(`return ${metaString}`)();
  } catch (error) {
    console.error('Failed to extract page meta:', error);
    return null;
  }
}
