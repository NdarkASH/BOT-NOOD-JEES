const path = require('path');
const getAllFiles = require('./getAllFiles');

module.exports = (exceptions = []) => {
  const localCommands = [];


  const commandCategories = getAllFiles(
    path.join(__dirname, '..', 'commands'),
    true
  );
  //   console.log(commandCategory);
  for (const commandCategory of commandCategories) {
    const commandFiles = getAllFiles(commandCategory);

    for (const commandFile of commandFiles) {
      const commandObject = require(commandFile);

      if (exceptions.includes(commandObject.name)){
        continue;
      }
      // console.log(commandObject);
      localCommands.push(commandObject);
    }

  }

  // console.log(localCommands);
  return localCommands;
};