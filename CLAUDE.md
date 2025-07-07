# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Package Management

- Use `pnpm` as the package manager (required version >=8)
- Install dependencies: `pnpm install`
- Install workspace package: `pnpm add <package> --filter=<workspace>`

### Development

- Start all development servers: `pnpm dev`
- Start specific package dev: `turbo run dev --filter=<package-name>`
- Test RSBuild integration: `pnpm play:rsbuild-vue3-js`
- Test Vite integration: `pnpm play:vite-vue3-js`
- Start documentation: `pnpm docs:dev`

### Building and Testing

- Build all packages: `pnpm build`
- Build specific package: `turbo run build --filter=<package-name>`
- Run all tests: `pnpm test`
- Clean all builds: `pnpm clean`

### Code Quality

- Lint JavaScript/TypeScript: `pnpm lint:js`
- Lint CSS/SCSS: `pnpm lint:css`
- Fix all linting issues: `pnpm lint:fix`
- ESLint and Prettier configurations are in `packages/lint/src`

### Release Management

- Create changeset: `pnpm changeset`
- Version packages: `pnpm version-packages`
- Release packages: `pnpm release`

## Architecture Overview

### Monorepo Structure

This is a **plugin-focused monorepo** that provides Vue.js ecosystem tools:

- **packages/**: Core library packages (shared utilities, linting configs, Vue tools)
- **apps/**: Applications (documentation site, examples)
- **play/**: Testing playgrounds for different build tools

### Key Architectural Patterns

#### 1. Build Tool Agnostic Design

The core functionality (especially in `packages/vue-router`) is designed to work with multiple build tools:

- RSBuild (primary focus)
- Vite
- Webpack

Each build tool has its own plugin implementation that wraps the core functionality.

#### 2. Virtual Module System

The `packages/vue-router` package uses virtual modules (like `~virtual-routes`) to inject generated route configurations into applications seamlessly.

#### 3. File-System Based Convention

Route generation follows file-system conventions similar to `vite-plugin-pages`:

- `[id].vue` for dynamic routes
- `_layout.vue` for layout components
- Directory structure maps to route hierarchy

### Package Responsibilities

- **`@x-library/core`**: Base utilities and shared functionality
- **`@x-library/lint`**: Comprehensive linting configurations (ESLint, Prettier, Stylelint, Commitlint)
- **`@x-library/utils`**: Common utility functions
- **`@x-library/vue`**: Vue-specific utilities and helpers
- **`@x-library/vue-router`**: Automatic route generation and layout system for Vue Router

## Development Guidelines

### Testing Strategy

- Primary testing location: `/play/rsbuild-project-vue3-js`
- Test each feature module before continuing development
- Ensure functionality works across different build tools

### Code Style

- Use TypeScript for all new code
- Follow existing ESLint and Prettier configurations
- Variable/function naming: camelCase
- Constants: UPPER_SNAKE_CASE
- Never add README files unless explicitly requested

### Build Tool Integration Pattern

When adding support for a new build tool in `packages/vue-router`:

1. Create build-tool specific directory (e.g., `/rsbuild`, `/vite`, `/webpack`)
2. Implement plugin wrapper that uses core scanner/parser/generator
3. Handle virtual module registration for that build tool
4. Ensure API consistency across all build tools

### Git Workflow

- Follow conventional commits (enforced by commitlint)
- Use lint-staged for pre-commit quality checks
- Check git changes before development to understand current work

## TypeScript Configuration

- Strict TypeScript enabled
- Path aliases configured: `"@x-library/*": ["packages/*/src"]`
- Dual ESM/CJS package support
- Automatic declaration file generation

## Special Considerations

### Vue Router Package Development

The current focus is on `packages/vue-router` which provides:

- Automatic route generation from file system
- Layout system with nesting support
- Multi-build-tool plugin architecture

Reference implementations to understand: `vite-plugin-pages` and `vite-plugin-vue-layouts`.

### Documentation

- Documentation site built with VitePress
- Available at: https://a563346904.github.io/x-library/
- Local development: `pnpm docs:dev`
