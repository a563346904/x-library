# 项目规则

## 代码风格规则

- 使用 TypeScript 进行开发
- 遵循 ESLint 和 Prettier 配置，eslint 和 prettier 规则见 /Users/kangjunpeng/Documents/project/x-library/packages/lint/src 文件夹下
- 变量和函数命名采用 camelCase
- 常量采用 UPPER_SNAKE_CASE

## 项目特定规则

- 在 packages 目录下开发共享组件
- 在 play 目录下是我的测试应用，目前我在 packages 目录下开发完的功能，优先在/Users/kangjunpeng/Documents/project/x-library/play/rsbuild-project-vue3-js下面测试
- 遵循模块化设计原则
- 使用 pnpm 作为包管理器
- 完成功能后不必自己添加 readme 文件，我需要你添加时再添加

## AI 辅助规则

- 生成的代码应该遵循项目现有的编码风格
- 优先使用项目中已有的库和工具
- 避免引入不必要的依赖
- 提供清晰的代码注释
- 在可能的情况下优化代码性能
- 开发每一个功能前优先和我确定开发顺序，不要直接生成代码
- 开发一部分功能后， 先测试这部分功能可行性，再继续往下开发
- 我每次开发完成一个功能后会一起提交， 每次编辑之前先参照我的 git change 区域的内容， 读懂我的思想后继续开发不要重新去开发重复的部分

## 项目介绍

打造一个插件库， 所有的插件以子包的形式存在于/Users/kangjunpeng/Documents/project/x-library/packages下，

## 项目目录介绍

- packages
  - lint 存放 eslint，prettier，styleint，commitlint (已完成， 后续代码开发和提交按照这里的规范执行)
  - utils 包 (后续开发)
  - vue (vue生态相关的包， 后续开发)
  - vue-router (vue-router相关的扩展插件)

## 响应语言

- 请始终使用简体中文回复
