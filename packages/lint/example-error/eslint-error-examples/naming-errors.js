// 不使用驼峰命名法
// 'camelcase': 'off' - 禁用驼峰命名法检查
// 'no-underscore-dangle': 'off' - 禁用下划线变量名检查
// 'new-cap': 'off' - 禁用构造函数首字母大写检查
let user_name = 'John';
let user_age = 30;

// 构造函数名应该使用首字母大写
function user(name, age) {
  this.name = name;
  this.age = age;
}

// 创建构造函数实例但未使用new关键字
const newUser = user('Alice', 25);

// 使用下划线开头的变量名
let _privateVar = 'secret';
let __internalData = { key: 'value' };

// 允许的下划线变量例外（_id, __dirname, __filename）
const _id = '12345';
const __dirname = '/path/to/dir';
const __filename = '/path/to/file';

// 类名应该使用首字母大写
class userProfile {
  constructor(user) {
    this.user = user;
  }
}

// 构造函数没有使用大写字母开头
function createComponent() {
  this.render = function() {
    return '<div>Component</div>';
  };
}
