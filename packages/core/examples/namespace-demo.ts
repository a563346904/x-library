import { createNamespace } from '@x-library/core';

// 示例 1: 使用默认配置
console.log('=== 默认配置 ===');
const defaultNs = createNamespace();
console.log(defaultNs.getName('Layout')); // XLayout
console.log(defaultNs.getName('LayoutProvider')); // XLayoutProvider

// 示例 2: 自定义前缀
console.log('\n=== 自定义前缀 ===');
const appNs = createNamespace({ prefix: 'App' });
console.log(appNs.getName('Layout')); // AppLayout
console.log(appNs.getName('LayoutProvider')); // AppLayoutProvider

// 示例 3: 使用分隔符
console.log('\n=== 使用分隔符 ===');
const dashNs = createNamespace({ prefix: 'My', separator: '-' });
console.log(dashNs.getName('Layout')); // My-Layout
console.log(dashNs.getName('LayoutProvider')); // My-LayoutProvider

// 示例 4: 空前缀（不使用命名空间）
console.log('\n=== 空前缀 ===');
const noNs = createNamespace({ prefix: '' });
console.log(noNs.getName('Layout')); // Layout
console.log(noNs.getName('LayoutProvider')); // LayoutProvider

// 示例 5: 禁用 PascalCase
console.log('\n=== 禁用 PascalCase ===');
const lowerNs = createNamespace({ prefix: 'app', pascalCase: false });
console.log(lowerNs.getName('Layout')); // appLayout
console.log(lowerNs.getName('LayoutProvider')); // appLayoutProvider

// 示例 6: 批量生成名称映射
console.log('\n=== 批量生成名称映射 ===');
const myNs = createNamespace({ prefix: 'My' });
const nameMap = myNs.createNameMap(['Layout', 'LayoutProvider', 'Button', 'Icon']);
console.log(nameMap);
// {
//   Layout: 'MyLayout',
//   LayoutProvider: 'MyLayoutProvider',
//   Button: 'MyButton',
//   Icon: 'MyIcon'
// }

// 示例 7: 组件工厂
console.log('\n=== 组件工厂 ===');
const vueNs = createNamespace({ prefix: 'Vue' });

// 模拟 Vue 组件创建函数
const createVueComponent = (name: string) => {
  return {
    name,
    render: () => `<div>Component: ${name}</div>`
  };
};

const layoutComponent = vueNs.createComponentFactory(createVueComponent, 'Layout');
console.log(layoutComponent);
// { name: 'VueLayout', render: [Function] }

// 示例 8: 获取配置
console.log('\n=== 获取配置 ===');
const configNs = createNamespace({ prefix: 'Test', separator: '_' });
console.log(configNs.getConfig());
// { prefix: 'Test', separator: '_', pascalCase: true }
