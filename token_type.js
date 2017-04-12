const Type = {
  1: "MARK",
  2: "NUM",
  3: "ID"
};

const reserved = {
  "if": "IF",
};

const mark = {
  "\n": "ENTER",
  "(": "LPARENT",
  ")": "RPARENT",
  "{": "LBRACKET",
  "}": "RBRACKET",
  "=": "EQ",
  "+": "ADD",
  "-": "REDUCE",
  "*": "MUT",
  "/": "AVER",
}

module.exports = (type, token) => {
  if(type === 3) {
    return reserved[token] || Type[type];
  } else if(type === 1) {
    return mark[token];
  }
  return Type[type];
};