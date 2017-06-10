const TokenParser = require('./token_parser');
const operatorAss = require('./opertaion_ass');

class ASTParser {
  constructor(tokens = []) {
    this.tokens = tokens;
    this.chains = this._split();
  }
  parse() {
    return this.chains.map((d, i) => {
      return this._buildTree(d, 0, null);
    });
  }
  _findInterval(l, r, tokens, pos) {
    const stk = [];
    for(let len = tokens.length; pos < len; pos ++) {
      const d = tokens[pos];
      if(d.token === l) {
        stk.push(l);
      }
      else if(d.token === r) {
        stk.pop();
        if(stk.length === 0) {
          return pos;
        }
      }
    }
  }
  _split() {
    const chains = [];
    const len = this.tokens.length - 1;

    let chain = [];

    this.tokens
      .filter(d => d.type !== "ENTER")
      .forEach((d, i) => {
        if(d.type === 'SEMICOLON' || len === i) {
          chain.length > 0 && chains.push(chain);
          chain = [];
        }
        else {
          chain.push(d);
        }
      });
    return chains;
  }
  _buildTree(tokens, pos = 0, prevNode = null) {

    const token = tokens[pos];
    const prevToken = tokens[pos - 1];
    if(pos === tokens.length) {
      return prevNode;
    }
    // this._checkSyntaxError(tokens.slice(0, pos + 1), tokens.length - 1 === pos);
    const node = this._buildNode(token);
    // 如果是各种辅助运算符就不会被写入到AST中，只会影响树的构建
    if(
      token.type === 'RBRACKET' || 
      token.type === 'RPARENT'  || 
      token.type === 'LBRACKET' || 
      token.type === 'LPARENT'  || 
      token.type === 'DEF'
    ) {
      if(token.type === 'LPARENT') {
        const end = this._findInterval('(', ')', tokens, pos);
        const group = this._buildTree(tokens.slice(0, end), pos + 1, null);
        return this._buildTree(tokens, end + 1, group);
      }
      return this._buildTree(tokens, pos + 1, prevNode);
    }
    // 如果是定义变量的话就把这个ID的type改成DEF，方便最后解析AST树
    if(prevToken && prevToken.type === 'DEF') {
      node.type = prevToken.type;
    }
    // 如果是NUN或ID就递归构建AST树
    if(token.type === 'NUM' || token.type === "ID") {
      return this._buildTree(tokens, pos + 1, node);
    }
    
    if(token.type === 'OPERATOR') {
      node.left = prevNode;
      if(tokens[pos + 1].type === 'LPARENT' && token.token !== '=') {
        const end = this._findInterval('(', ')', tokens, pos);
        node.right = this._buildTree(tokens.slice(0, end + 1), pos + 1);
        return this._buildTree(tokens, end + 1, node);
      }
      else if(!operatorAss[token.token]) {
        node.right = this._buildTree(tokens, pos + 1, null);
        return node;
      }
      else {
        node.right = this._buildNode(tokens[pos + 1]);
        return this._buildTree(tokens, pos + 2, node);
      }
    }

  }
  _buildNode(token) {
    return {
      token: token.token,
      type: token.type,
      left: null,
      right: null
    };
  }
  _checkSyntaxError(chain, islast) {
    
    if(islast) {
      if(this.parentStk.length > 0 || this.bracketStk.length > 0) {
        throw new SyntaxError(`Unexpected input`);
      }
    }
  }
}

module.exports = (code) => {
  return new ASTParser(new TokenParser(code).parse()).parse();
};
