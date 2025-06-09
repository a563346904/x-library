#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';

// 直接使用项目根目录的 eslint
const eslintPath = path.join(process.cwd(), 'node_modules', 'eslint', 'bin', 'eslint.js');

const child = spawn('node', [eslintPath, ...process.argv.slice(2)], {
  stdio: 'inherit',
  cwd: process.cwd()
});

child.on('exit', c => {
  process.exit(c);
});
