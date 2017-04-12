const TokenParser = require('./token_parser');

class ASTParser {
  constructor(tokens = []) {
    this.tokens = tokens;
  }
}

const p = new TokenParser(`
  a = 10 + 1
  b = 10
  if(a) {
    log(a)
  }
  def foo() {
    ret 1
  }
  def bar() {
    log(a)
    a = foo()
  }
`);
console.log(p.parse());
