import { Command } from 'commander';

import { bootstrap } from './bootstrap.js';
import { CliApplication } from './presentation/applications/cli.application.js';

async function main() {
  const program = new Command();

  program
    .version('1.0.0')
    .description('Transaction Import CLI')
    .hook('preAction', async (thisCommand) => {
      try {
        const app = await CliApplication.create();
        thisCommand.setOptionValue('app', app);
      } catch (error) {
        console.error('Error initializing application', error);
        process.exit(1);
      }
    });

  program
    .command('import-vehicles')
    .description('Import vehicles and create transactions from a JSON file')
    .requiredOption('-f, --file <path>', 'Path to JSON file containing vehicles data')
    .action(async (options, command) => {
      const app: CliApplication = command.parent.getOptionValue('app');

      try {
        const filePath = options.file;

        await bootstrap(app);

        await app.importVehicles(filePath);
        await app.stop();
      } catch (error) {
        console.error('Error importing vehicles', error);
        await app.stop();
        process.exit(1);
      }
    });

  await program.parseAsync(process.argv);
}
main();
