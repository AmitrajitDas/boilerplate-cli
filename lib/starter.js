const chalk = require("chalk");
const { exec } = require("child_process");
const editJsonFile = require("edit-json-file");
const { createWriteStream, readdir } = require("fs");
const { writeFile } = require("gitignore");
const inquirer = require("inquirer");
const chalkAnimation = require("chalk-animation");
const { ncp } = require("ncp");
const ora = require("ora");
const figlet = require("figlet");
const path = require("path");
const { promisify } = require("util");

const readDir = promisify(readdir);
const asyncExec = promisify(exec);
const writeGitignore = promisify(writeFile);

/**
 * @method createProject
 * @description Create a project
 */
const starter = async (project) => {
  let spinner;
  try {
    // const rainbow = chalkAnimation.rainbow("Hello!");
    // setTimeout(() => {
    //   rainbow.start(); // Animation resumes
    // }, 1000);

    greetings("TYPIFY");
    const template = await chooseTemplates();
  } catch (err) {}
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
    width: 80,
    whitespaceBreak: true,
  };

  figlet.text(greetingText, textConfig, (err, data) => {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    console.log(data);
  });
};

/**
 * @method getDirectories
 * @description Get the templates directory.
 */
const getTemplateDir = async () => {
  console.log(__dirname);
  const contents = readDir(__dirname, { withFileTypes: true });
};

/**
 * @method chooseTemplates
 * @description Choose a template.
 */
const chooseTemplates = async () => {
  const directories = await getTemplateDir();
};

module.exports = starter;
