const tokenExp = {
  "NUM": /[0-9]/,
  "ID": /[_a-zA-Z]/,
  "MARK": /`/,
};
/**
 * 数组下标意义
 * -1 代表语法错误
 * -2 代表重复上次状态 
 * 1 代表初始状态
 * 2 代表数字
 * 3 代表变量
 * 4 代表字符串
 * 5 代表运算符
 * 6 代表括号
 */
module.exports = new Proxy({
  "NUM": [0, 2, 2, 3, 4],
  "ID": [0, 3, -1, 3, 4],
  "MARK": [0, 4, -1, -1, 1],
}, {
  get: (target, key, receiver) => {
    let targetKey = getTokenType(key);
    if(!targetKey) return [0, 1, 1, 1, 4];
    return Reflect.get(target, targetKey, receiver);
  },
  set: () => {
    throw new TypeError("You can not set dfa values");
  }
});

function getTokenType(token) {
  for(const key in tokenExp) {
    if(tokenExp[key].test(token)) {
      return key;
    }
  }
}