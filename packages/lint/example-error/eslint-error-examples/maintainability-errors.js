// 超过10的循环复杂度
// 'complexity': 'off' - 禁用函数复杂度检查
// 'max-depth': 'off' - 禁用嵌套深度检查
// 'max-params': 'off' - 禁用函数参数数量检查
// 'max-lines-per-function': 'off' - 禁用函数行数限制检查
function complexFunction(value) {
  if (value === 1) {
    return 'one';
  } else if (value === 2) {
    return 'two';
  } else if (value === 3) {
    return 'three';
  } else if (value === 4) {
    return 'four';
  } else if (value === 5) {
    return 'five';
  } else if (value === 6) {
    return 'six';
  } else if (value === 7) {
    return 'seven';
  } else if (value === 8) {
    return 'eight';
  } else if (value === 9) {
    return 'nine';
  } else if (value === 10) {
    return 'ten';
  } else if (value === 11) {
    return 'eleven';
  } else {
    return 'other';
  }
}

// 嵌套过深的代码（超过4层嵌套）
function deeplyNested(data) {
  if (data) {
    if (data.user) {
      if (data.user.profile) {
        if (data.user.profile.preferences) {
          if (data.user.profile.preferences.theme) {
            return data.user.profile.preferences.theme;
          }
        }
      }
    }
  }
  return 'default';
}

// 超过50行的函数
function veryLongFunction() {
  let result = 0;

  // 以下是超过50行的函数内容
  console.log('Starting calculation...');

  for (let i = 0; i < 10; i++) {
    result += i;
    console.log(`Adding ${i} to result`);
  }

  for (let i = 0; i < 10; i++) {
    result += i * 2;
    console.log(`Adding ${i * 2} to result`);
  }

  console.log('Performing additional calculations...');

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      result += i * j;
      console.log(`Adding ${i * j} to result`);
    }
  }

  console.log('Almost done...');

  if (result > 1000) {
    console.log('Result is greater than 1000');
    result = 1000;
  } else if (result > 500) {
    console.log('Result is greater than 500');
    result = 500;
  } else {
    console.log('Result is less than or equal to 500');
  }

  // 继续添加更多的代码行以超过50行
  console.log('Finalizing calculation...');
  result = Math.min(result, 9999);
  console.log(`Final result capped at ${result}`);

  return result;
}

// 超过4个参数的函数
function tooManyParams(param1, param2, param3, param4, param5, param6) {
  return param1 + param2 + param3 + param4 + param5 + param6;
}
