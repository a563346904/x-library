// 导入顺序错误示例
// 'import/no-duplicates': 'off' - 禁用重复导入检查
// 'import/order': 'off' - 禁用导入顺序检查
// 'import/newline-after-import': 'off' - 禁用导入后换行检查
// 'no-redeclare': 'off' - 禁用重复声明检查
// 'prettier/prettier': 'off' - 禁用prettier格式检查
import '../utils/helper';
import { useState } from 'react';
import axios from 'axios';
import path from 'path';

// 重复导入错误
import axios from 'axios';








// 导入后没有换行
import { useEffect } from 'react';
export function Component() {
  // 组件实现
}

// 导入排序不正确，按字母顺序和分组都有问题
import fs from 'fs';
import { render } from 'react-dom';
import config from '../config';
import lodash from 'lodash';

// 组件实现
export function Component() {
  // 组件实现
}
