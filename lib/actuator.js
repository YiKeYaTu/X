const errorMap = require('./error');

function actuator(asts) {
  const env = [];
  asts.forEach((ast) => {
    eval(ast, env);
  });
}

function eval(node, env = []) {
  const type = node.type;
  if('OPERATOR' === type) {
    return eval[node.token](node.left, node.right, env);
  } else {
    if('NUM' === node.type) {
      return parseFloat(node.token);
    } else {
      try {
        return env[_findVar(node.token, env)].value;
      } catch(e) {
        errorMap[0](node.token);
      }
    }
  }
}

function _findVar(varname, env) {
  return env.map(d => d.varname).indexOf(varname);
}

eval['='] = (left, right, env) => {
  const ans = eval(right, env);
  if(left.type === 'DEF') {
    env.push({
      varname: left.token,
      value: ans
    });
  } else {
    try {
      const index = env.map(d => d.varname).indexOf(left.token);
      env[index].value = ans;
    } catch(err) {
      errorMap[0](left.token);
    }
  }
  return ans;
};

eval['+'] = (left, right, env) => eval(left, env) + eval(right, env);

eval['-'] = (left, right, env) => eval(left, env) - eval(right, env);

eval['*'] = (left, right, env) => eval(left, env) * eval(right, env);

eval['/'] = (left, right, env) => eval(left, env) / eval(right, env);

eval['%'] = (left, right, env) => eval(left, env) % eval(right, env);

module.exports = actuator;