import MagicString from 'magic-string';

/**
 * 转换 definePageMeta 宏
 * 提取页面元数据并注入到组件中
 */
export function transformDefinePageMeta(
  code: string,
  id: string
): { code: string; map?: any } | null {
  // 只处理 Vue 文件
  if (!id.endsWith('.vue')) {
    return null;
  }

  // 检查是否包含 definePageMeta
  if (!code.includes('definePageMeta')) {
    return null;
  }

  const s = new MagicString(code);

  // 使用正则表达式匹配 definePageMeta 调用
  // 支持多种格式：definePageMeta({ ... }) 或 definePageMeta({...})
  const definePageMetaRegex = /definePageMeta\s*\(\s*({[\s\S]*?})\s*\)/g;

  let hasTransformed = false;
  let pageMeta: any = null;

  let match;
  while ((match = definePageMetaRegex.exec(code)) !== null) {
    const [fullMatch, metaString] = match;
    const start = match.index;
    const end = start + fullMatch.length;

    try {
      // 使用 Function 构造函数安全地解析对象字面量
      // 注意：这里假设 definePageMeta 的参数是一个简单的对象字面量
      // eslint-disable-next-line no-new-func
      pageMeta = new Function(`return ${metaString}`)();

      // 移除 definePageMeta 调用
      s.remove(start, end);
      hasTransformed = true;
    } catch (error) {
      console.error(`Failed to parse definePageMeta in ${id}:`, error);
    }
  }

  if (!hasTransformed || !pageMeta) {
    return null;
  }

  // 查找 <script setup> 标签的结束位置
  const scriptSetupMatch = code.match(/<script\s+setup[^>]*>/);
  if (scriptSetupMatch) {
    const scriptStart = scriptSetupMatch.index! + scriptSetupMatch[0].length;

    // 注入页面元数据
    const injection = `
// Injected by definePageMeta transform
const __pageMeta = ${JSON.stringify(pageMeta)};
`;

    s.appendLeft(scriptStart, injection);
  }

  // 在组件导出中添加 __pageMeta 属性
  const exportDefaultMatch = code.match(/export\s+default\s+{/);
  if (exportDefaultMatch) {
    const exportStart = exportDefaultMatch.index! + exportDefaultMatch[0].length;
    s.appendLeft(exportStart, `\n  __pageMeta: ${JSON.stringify(pageMeta)},`);
  } else if (code.includes('<script setup>')) {
    // 对于 <script setup>，需要在编译后的代码中注入
    // 这通常由构建工具的 Vue 插件处理
    // 我们可以添加一个特殊的注释标记
    const templateMatch = code.match(/<template>/);
    if (templateMatch) {
      const comment = `\n<!-- __pageMeta: ${JSON.stringify(pageMeta)} -->\n`;
      s.appendLeft(templateMatch.index!, comment);
    }
  }

  return {
    code: s.toString(),
    map: s.generateMap({ hires: true })
  };
}

/**
 * 从代码中提取 definePageMeta 的参数
 * 用于路由生成器
 */
export function extractPageMeta(code: string): any | null {
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
