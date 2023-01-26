const path = require("path");
const starter = require("../lib/starter");

const getDest = (destDir = "typify") => {
  return path.join(process.cwd(), destDir);
};

const dest = getDest(process.argv[2]);
starter(dest);
