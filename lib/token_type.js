const Type = {
  1: "MARK",
  2: "NUM",
  3: "ID"
};

const reserved = {
  "if": "IF",
  'def': 'DEF',
};

const mark = {
  "\n": "ENTER",
  "(":  "LPARENT",
  ")":  "RPARENT",
  "{":  "LBRACKET",
  "}":  "RBRACKET",
  "=":  "OPERATOR",
  "+":  "OPERATOR",
  "-":  "OPERATOR",
  "*":  "OPERATOR",
  "/":  "OPERATOR",
  ";":  "SEMICOLON"
}

module.exports = (type, token) => {
  if(type === 3) {
    return reserved[token] || Type[type];
  } else if(type === 1) {
    return mark[token];
  }
  return Type[type];
};