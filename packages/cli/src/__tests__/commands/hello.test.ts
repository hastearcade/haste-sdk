import { Config } from '@oclif/config';
import Hello from '../../commands/hello';

describe('Hello Command', () => {
  let result: (string | Uint8Array)[];

  beforeEach(() => {
    result = [];
    jest.spyOn(process.stdout, 'write').mockImplementation((val) => {
      result.push(val);
      return true;
    });
  });

  afterEach(() => jest.restoreAllMocks());

  it('should print Hello message', async () => {
    const helloCommand = new Hello(
      [],
      new Config({
        root: 'root',
      }),
    );
    await helloCommand.run();
    expect(result[0]).toContain('hello test from ./src/commands/hello.ts\n');
  });
});
