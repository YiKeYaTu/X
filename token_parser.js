const DFA = require("./dfa");
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
    let token = "";
    let type = -1;
    const tokens = [];
    for(let i = 0, len = this.text.length; i < len; i ++) {
      let char = this.text[i];
      let toStatus = DFA[char][status];
      if(type === -1) type = status;
      if(toStatus === 1 || toStatus !== status) {
        if(token.replace(/ /g, "")) {
          tokens.push(new Token(i, type, token))
        };
        type = -1;
        token = "";
      }
      token += char;
      status = toStatus;
    }
    return tokens;
  }
}

module.exports = TokenParser;