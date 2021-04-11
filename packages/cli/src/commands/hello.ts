import { Command, flags } from '@oclif/command';
import { Game } from '@haste-sdk/domain';

export default class Hello extends Command {
  static description = 'describe the command here';

  static examples = [
    `$ haste hello
hello world from ./src/hello.ts!
`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' }),
  };

  static args = [{ name: 'file' }];

  // eslint-disable-next-line @typescript-eslint/require-await
  async run() {
    const { args, flags } = this.parse(Hello);
    const g = new Game('test');

    const name = flags.name ?? g.name;
    this.log(`hello ${name} from ./src/commands/hello.ts`);
    if (args.file && flags.force) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      this.log(`you input --force and --file: ${args.file}`);
    }
  }
}
