const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");

function ATOI(string) {
  string = Number(string)

  if (!Number.isInteger(string)) {
    throw new NotFoundError('not found');
  }

  return string
}

module.exports = ATOI;
