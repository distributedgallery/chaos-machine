import yargs from 'yargs'
import * as commands from './commands'

const argv = yargs
  .usage('chaos <command>')
  .command(commands.config)
  .command(commands.daemon)
  .demandCommand(1, 'No command provided')
  .strict()
  .help()
  .alias('h', 'help').argv
