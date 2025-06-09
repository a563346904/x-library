// 使用Array构造函数
// 'no-array-constructor': 'off' - 禁用数组构造函数检查
// '@typescript-eslint/no-array-constructor': 'off' - 禁用TS数组构造函数检查
// 'no-new-object': 'off' - 禁用对象构造函数检查
// 'no-new-wrappers': 'off' - 禁用包装对象构造函数检查
// 'no-loop-func': 'off' - 禁用循环中创建函数检查
const arr1 = new Array(1, 2, 3, 4, 5); // 应该使用数组字面量

// 在循环中创建函数
function processItems(items) {
  const results = [];

  for (let i = 0; i < items.length; i++) {
    // 在循环中创建函数会导致每次迭代都创建新的函数实例
    results.push(function() {
      return items[i] * 2;
    });
  }

  return results;
}

// 使用Object构造函数
const user = new Object(); // 应该使用对象字面量
user.name = 'John';
user.age = 30;

// 使用包装对象构造函数
const str = new String('Hello'); // 应该使用字符串字面量
const num = new Number(42); // 应该使用数字字面量
const bool = new Boolean(true); // 应该使用布尔字面量

// 原始类型的包装对象会创建不必要的对象实例
function formatValue(value) {
  if (value instanceof Number) {
    return value.toFixed(2);
  }
  return value;
}
