// 使用var而不是const/let
// 'no-var': 'off' - 禁用var检查
// 'object-shorthand': 'off' - 禁用对象简写语法检查
// 'prefer-template': 'off' - 禁用模板字符串检查
// 'prefer-const': 'off' - 禁用const检查
var count = 10;
var message = 'Hello';

// 未使用对象简写语法
const user = {
  name: name,
  age: age,
  getData: function() {
    return this.name;
  }
};

// 应该使用const而不是let（变量未被重新赋值）
let MAX_SIZE = 100;
let API_URL = 'https://api.example.com';

// 应该使用模板字符串
let greeting = 'Hello ' + user.name + '! Welcome to ' + API_URL;

// 未优化的条件表达式
function getStatus() {
  if (count > 0) {
    return true;
  } else {
    return false;
  }
}
