const path = require("path");
const inquirer = require("inquirer");
const figlet = require("figlet");
const gradient = require("gradient-string");
const starter = require("../lib/starter");
const sleep = require("../utils/sleep");

/**
 * @method getDest
 * @description getting the destination directory where project will get initialized
 */
const getDest = (destDir = "boilerplate-cli") => {
  return path.join(process.cwd(), destDir);
};

/**
 * @method projectName
 * @description Asks for the name of the project template
 */
const projectName = async () => {
  greetings("BOILERPLATE CLI");
  await sleep(1000);
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

/**
 * @method figlet
 * @description Figlet Welcome Text
 */
const greetings = (greetingText) => {
  const textConfig = {
    font: "Star Wars",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 150,
    whitespaceBreak: true,
  };

  figlet.text(greetingText, textConfig, (err, data) => {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    console.log(gradient.pastel(data));
  });
};

projectName();
