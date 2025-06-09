// 使用eval
// 'no-eval': 'off' - 禁用eval检查
// 'no-new-func': 'off' - 禁用Function构造函数检查
// 'no-implied-eval': 'off' - 禁用隐式eval检查
// 'no-caller': 'off' - 禁用arguments.callee检查
// 'no-extend-native': 'off' - 禁用扩展原生对象检查
// 'no-proto': 'off' - 禁用__proto__检查
// 'no-script-url': 'off' - 禁用javascript:URL检查
// 'no-return-assign': 'off' - 禁用return赋值检查
// 'no-throw-literal': 'off' - 禁用throw字面量检查
function executeCode(code) {
  eval(code); // 不安全的代码执行
}

// 使用Function构造函数
function createFunction(body) {
  return new Function('a', 'b', body); // 不安全的代码生成
}

// 使用implied eval
function calculateValue(expression) {
  return setTimeout('alert(' + expression + ')', 100); // 隐式eval
}

// 使用caller属性
function badCaller() {
  const caller = arguments.callee.caller;
  console.log('Called by:', caller.name);
}

// 扩展原生对象
Array.prototype.customMethod = function() {
  return this.length;
};

// 使用__proto__
function manipulatePrototype(obj) {
  obj.__proto__ = { malicious: true };
  return obj;
}

// 使用javascript:URL
function redirectToPage() {
  window.location = 'javascript:alert("Redirecting...")'; // 不安全的URL
}

// 使用返回赋值
function processValue(value) {
  return value = value * 2; // 返回赋值表达式
}

// 使用throw字面量
function handleError(message) {
  throw message; // 应该抛出Error对象
}
