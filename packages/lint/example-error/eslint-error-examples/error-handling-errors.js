// 缺少default case
// 'default-case': 'off'
// '@typescript-eslint/no-unused-vars': 'off',
// 'no-unused-vars': 'off'
function processStatus(status) {
  switch (status) {
    case 'success':
      return 'Operation completed successfully';
    case 'error':
      return 'Operation failed';
    case 'pending':
      return 'Operation in progress';
    // 缺少 default case
  }
}

// 空的代码块
function emptyFunction() {
  // 空函数体
}

// 空的catch块
try {
  // 一些可能抛出错误的操作
  // 'no-undef': 'off',
  fetchData();
} catch (error) {
  // 空的catch块，没有任何错误处理
}

// 代码不可达
function processOrder(order) {
  if (!order) {
    return null;
  }

  if (order.status === 'canceled') {
    return;
  }

  return order.id;

  // 不可达代码
  // 'no-unreachable': 'off'
  console.log('Processing order:', order.id);
}

// 未使用的表达式
function unusedExpressions() {
  let value = 5;
  // 'no-unused-expressions': 'off'
  value + 10; // 未使用的表达式
  value * 2; // 未使用的表达式

  return value;
}

// case语句没有break导致穿透
function getSeverity(code) {
  let severity = '';

  switch (code) {
    case 1:
      severity = 'low';
    case 2:
      severity = 'medium';
    case 3:
      severity = 'high';
    default:
      severity = 'unknown';
  }

  return severity;
}
