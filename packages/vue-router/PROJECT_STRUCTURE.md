# @x-library/vue-router 项目结构

```
packages/vue-router/
├── src/
│   ├── core/
│   │   ├── scanner.ts           # 文件系统扫描实现
│   │   ├── generator.ts         # 路由生成逻辑
│   │   ├── parser.ts            # 文件路径解析功能
│   │   ├── layout.ts            # 布局系统核心功能
│   │   ├── route-block.ts       # <route>块解析功能
│   │   ├── virtual.ts           # 虚拟模块处理逻辑
│   │   ├── types.ts             # 核心类型定义
│   │   └── index.ts             # 核心模块导出
│   │
│   ├── rsbuild/
│   │   ├── plugin.ts            # RSBuild插件实现
│   │   ├── virtual-module.ts    # RSBuild虚拟模块实现
│   │   └── index.ts             # RSBuild插件导出
│   │
│   ├── vite/
│   │   ├── plugin.ts            # Vite插件实现
│   │   ├── virtual-module.ts    # Vite虚拟模块实现
│   │   └── index.ts             # Vite插件导出
│   │
│   ├── webpack/
│   │   ├── plugin.ts            # Webpack插件实现
│   │   ├── virtual-module.ts    # Webpack虚拟模块实现
│   │   └── index.ts             # Webpack插件导出
│   │
│   └── index.ts                 # 主入口文件
│
├── tests/                       # 测试目录
│   ├── core/                    # 核心功能测试
│   ├── rsbuild/                 # RSBuild插件测试
│   ├── vite/                    # Vite插件测试
│   └── webpack/                 # Webpack插件测试
│
├── package.json                 # 包信息和依赖
├── tsconfig.json                # TypeScript配置
├── tsup.config.ts               # 构建配置
├── DESIGN.md                    # 设计文档
└── README.md                    # 使用说明
```

## 开发顺序建议

根据设计文档与项目优先级，建议按照以下顺序开发：

1. **第一阶段：核心功能**

   - 实现 `scanner.ts` - 文件系统扫描
   - 实现 `parser.ts` - 路径解析
   - 实现 `generator.ts` - 路由生成
   - 实现 `virtual.ts` - 虚拟模块处理逻辑
   - 测试核心功能可用性

2. **第二阶段：布局系统**

   - 实现 `layout.ts` - 布局系统
   - 实现 `route-block.ts` - 路由块解析
   - 测试布局功能可用性

3. **第三阶段：构建工具集成**

   - 实现 RSBuild 插件和虚拟模块
   - 在测试项目中验证功能
   - 实现 Vite 插件和虚拟模块
   - 实现 Webpack 插件和虚拟模块

4. **第四阶段：完善与优化**
   - 完善类型定义
   - 性能优化
   - 添加更多测试用例
   - 完善文档

## 虚拟模块实现方式

不同构建工具的虚拟模块实现有所不同：

1. **RSBuild** - 通过RSBuild的插件API创建虚拟模块
2. **Vite** - 利用Vite的resolveId和load钩子实现虚拟模块
3. **Webpack** - 使用webpack的NormalModuleReplacementPlugin实现虚拟模块

所有虚拟模块都将导出相同的API，确保用户体验的一致性。
