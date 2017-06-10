const DFA = require("./dfa").charDFA;
const Type = require("./token_type");

class Token {
  constructor(index, type, token) {
    this.index = index;
    this.token = token;
    this.type = Type(type, token);
  }
}

class TokenParser {
  constructor(text = "") {
    this.text = text + ' ';
  }
  parse() {
    let status = 1;
    let type = -1;
    let token = "";

    const tokens = [];

    this.text.split('').forEach((char, i) => {
      const toStatus = DFA[char][status];
      if(- 1 === type) {
        type = status;
      }
      if(1 === toStatus || toStatus !== status) {
        if(token.replace(/ /g, "")) {
          tokens.push(new Token(i, type, token))
        };
        type = - 1; token = "";
      }
      token += char;
      status = toStatus;
    });
    
    return tokens;
  }
}

module.exports = TokenParser;