const AstParser   = require('./lib/ast_parser');
const actuator    = require('./lib/actuator');

function go(code) {
  return actuator(AstParser(code));
}

go(`
  def a = 100;
  def b = a + 10;
`);

module.exports = go;