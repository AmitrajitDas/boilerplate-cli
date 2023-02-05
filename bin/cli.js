const path = require("path");
const inquirer = require("inquirer");
const starter = require("../lib/starter");

const getDest = (destDir = "typify") => {
  return path.join(process.cwd(), destDir);
};

const projectName = async () => {
  const { destDir } = await inquirer.prompt([
    {
      type: "input",
      name: "destDir",
      message: "What's your project name?",
    },
  ]);

  const dest = getDest(destDir);
  starter(dest);
};

projectName();
