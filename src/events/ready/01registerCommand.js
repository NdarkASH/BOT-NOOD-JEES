const { testServer } = require('../../../config.json');
const areCommandsDifferent = require('../../utils/areCommandsDifferent');
const getApplicationCommands = require('../../utils/getApplicationCommands');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client) => {
  try {
    const localCommands = getLocalCommands();
    // console.log(localCommands);
    const applicationCommands = await getApplicationCommands(
      client,
      testServer
    );

    for (const localCommand of localCommands) {
      const { name, description, options } = localCommand;

      const existingCommand = await applicationCommands.cache.find(
        (cmd) => cmd.name === name
      );
      // console.log(existingCommand);
      if (existingCommand) {
        if (localCommand.deleted) {
          await applicationCommands.delete(existingCommand.id);
          console.log(`"${name}" was deleted`);
          //   break;
          continue;
        }

        if (areCommandsDifferent(existingCommand, localCommand)) {
          await applicationCommands.edit(existingCommand.id, {
            description,
            options,
          });

          console.log(`Edited command "${name}"`);
        }
      } else {
        if (localCommand.deleted) {
          console.log(`Skiping registering command "${name}" has ben registered`);
          continue;
        }

        await applicationCommands.create({
          name,
          description,
          options,
        });

        console.log(`registered command "${name}"`);
      }
    }


  } catch (error) {
    console.error(`There was an error: ${error}`);
  }
//   console.log(localCommands);
};