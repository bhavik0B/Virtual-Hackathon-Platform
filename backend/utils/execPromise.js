const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function execPromise(cmd) {
  console.log("EXEC:", cmd);
  return await exec(cmd);
}

module.exports = { execPromise };
