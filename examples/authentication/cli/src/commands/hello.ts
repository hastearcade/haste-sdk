import { flags } from '@oclif/command';
import BaseCommand from '../common/base-command';

export default class Hello extends BaseCommand {
  static description = 'describe the command here';

  static examples = ['$ haste hello'];

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' }),
  };

  static args = [{ name: 'name' }];

  async run(): Promise<void> {
    const { args, flags } = this.parse(Hello);

    const name = args.name ?? 'world';
    this.logCommandStart(`hello ${name} from ./src/commands/hello.ts! Let's look at some things you can do!`);
    if (flags.force) {
      this.logEmphasis('you inputted the --force flag!');
    }

    // demo of the built in logging level messages.
    this.log('Just a simple message');
    this.logSuccess('this is a test success message');
    this.logWarning('this is a test warning message');
    this.logError('this is a test error message');
    this.logInfo('this is a test info message');

    // demo of the built in error batch
    this.errorBatch.add('error 1', 'error1');
    this.errorBatch.add("error 2, but let's update it here in a second..", 'error2');
    this.errorBatch.add('error 3', 'error3');
    this.errorBatch.add('error 4', 'error4');
    this.errorBatch.update('error 2', 'error2');
    this.errorBatch.remove('error4');
    this.logList(
      this.errorBatch.errors.map((x) => x.message),
      'we batched up some errors and did some CRUD operations on them.  Here is the final list:',
    );
    this.log(
      'to throw the error batch, call this.errorBatch.throw() and if there are any errors, execution will stop!',
    );

    // demo of the built in spinner
    const succeedSpinner = this.spinner.add('this spinner will succeed in 10 seconds');
    const failSpinner = this.spinner.add('this spinner will fail in 7 seconds');

    setTimeout(() => {
      failSpinner.fail();
    }, 7000);

    setTimeout(() => {
      succeedSpinner.succeed();
      this.logCommandFinish("and that's about it!!");
    }, 10_000);
  }
}
