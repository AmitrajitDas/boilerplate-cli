const chalk = require("chalk");
const { exec } = require("child_process");
const editJsonFile = require("edit-json-file");
const { createWriteStream, readdir } = require("fs");
const { writeFile } = require("gitignore");
const inquirer = require("inquirer");
const gradient = require("gradient-string");
const chalkAnimation = require("chalk-animation");
const { ncp } = require("ncp");
const ora = require("ora");
const figlet = require("figlet");
const path = require("path");
const { promisify } = require("util");
const { resolve } = require("path");

const readDir = promisify(readdir);
const asyncExec = promisify(exec);
const writeGitignore = promisify(writeFile);

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

/**
 * @method createProject
 * @description Create a project
 */
const starter = async (project) => {
  let spinner;
  try {
    greetings("TYPIFY");
    await sleep(1000);
    const template = await chooseTemplates();
    const isUpdated = await dependenciesUpdates();
    const isDeduped = await dependenciesDeduped();

    await animate("[ 1 / 3 ] copying template...", 1000);
    await animate("[ 2 / 3 ] fetching node_modules...", 1000);

    await copyProjectFiles(project, template);
    await updatePackageJson(projectName);
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
    console.log(gradient.pastel(data));
  });
};

/**
 * @method getDirectories
 * @description Get the templates directory.
 */
const getTemplateDir = async () => {
  const contents = await readDir(__dirname, { withFileTypes: true });
  const directories = contents
    .filter((content) => content.isDirectory())
    .map((content) => content.name);

  return directories;
};

/**
 * @method chooseTemplates
 * @description Choose a template.
 */
const chooseTemplates = async () => {
  const directories = await getTemplateDir();
  const { chooseTemplates } = await inquirer.prompt([
    {
      type: "list",
      name: "chooseTemplates",
      message: "Select a template",
      choices: [...directories, new inquirer.Separator()],
    },
  ]);

  return chooseTemplates;
};

/**
 * @method dependenciesUpdates
 * @description npm dependencies updated.
 */
const dependenciesUpdates = async () => {
  const { isUpdated } = await inquirer.prompt([
    {
      type: "confirm",
      name: "isUpdated",
      message: "Update the package dependencies to their latest versions ?",
    },
  ]);

  if (isUpdated) {
    const { isUpdatedReconfirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "isUpdatedReconfirm",
        message:
          "The updated dependencies may contain breaking changes. Continue to update the dependencies anyway ?",
      },
    ]);

    return isUpdatedReconfirm;
  }

  return false;
};

/**
 * @method dependenciesDeduped
 * @description npm duplicate dependencies removed.
 */
const dependenciesDeduped = async () => {
  const { isDeduped } = await inquirer.prompt([
    {
      type: "confirm",
      name: "isDeduped",
      message: "Deduplicate the package dependency tree (recommended) ?",
    },
  ]);

  return isDeduped;
};

/**
 * @method copyProjectFiles
 * @description Duplicate the template.
 */
const copyProjectFiles = async (destination, directory) => {
  return new Promise((resolve, reject) => {
    const source = path.join(__dirname, `./${directory}`);
    const options = {
      clobber: true,
      stopOnErr: true,
    };

    ncp.limit = 16;
    ncp(source, destination, options, function (err) {
      if (err) reject(err);
      resolve();
    });
  });
};

/**
 * @method updatePackageJson
 * @description Edit package.json.
 */
const updatePackageJson = async (destination) => {
  const file = editJsonFile(`${destination}/package.json`, { autosave: true });
  console.log({ file });
  console.log(path.basename(destination));
  file.set("name", path.basename(destination));
};

/**
 * @method installNodeModules
 * @description Install node modules.
 */
const installNodeModules = async (destination, spinner) => {
  spinner.text = "Install node_modules...\n";
  await asyncExec("npm install --legacy-peer-deps", { cwd: destination });
};

/**
 * @method animate
 * @description animates logs.
 */
const animate = async (text, timer = 2000) => {
  const rainbow = chalkAnimation.rainbow(text);
  rainbow.start();
  await sleep(timer);
  rainbow.stop();
};

module.exports = starter;
