// 使用any类型
// '@typescript-eslint/no-explicit-any': 'off' - 禁用any类型检查
// '@typescript-eslint/no-unused-vars': 'off' - 禁用未使用变量检查
// 'no-unused-vars': 'off' - 禁用未使用变量检查(JavaScript版本)
function processData(data: any): any {
  return data.map((item: any) => {
    return {
      id: item.id,
      name: item.name,
      value: item.value * 2
    };
  });
}

// 未使用的变量
function calculateTotal(items: number[]): number {
  const count = items.length; // 未使用的变量
  let total = 0;

  for (let i = 0; i < items.length; i++) {
    total += items[i];
  }

  const average = total / items.length; // 未使用的变量

  return total;
}

// 未使用的函数参数
function processUser(user: { id: string; name: string; age: number; role: string }) {
  console.log(`Processing user: ${user.id} - ${user.name}`);
  // age和role参数未使用
}

// 正确使用下划线前缀的未使用变量
function updateUser(userId: string, _timestamp: number) {
  console.log(`Updating user: ${userId}`);
  // _timestamp变量不会触发警告
}

// 忽略模式不匹配的未使用变量
function getData(source: string, options: { cache: boolean }) {
  const temp = source.toUpperCase(); // 未使用的变量，但前缀不是下划线

  if (options.cache) {
    console.log('Using cached data');
  }

  return 'data';
}
