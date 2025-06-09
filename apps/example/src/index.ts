import { createXLibrary } from '@x-library/core';

const unused = 456;

console.log(unused);

const main = () => {
  console.log('🚀 启动示例应用...');

  // 创建库实例
  const library = createXLibrary({
    name: 'X Library Demo',
    version: '1.0.0'
  });

  // 使用库的功能
  console.log(library.greet());
  console.log(library.greet('欢迎使用 X Library!'));

  console.log(`\n📦 库信息:`);
  console.log(`名称: ${library.getName()}`);
  console.log(`版本: ${library.getVersion()}`);
};

main();
