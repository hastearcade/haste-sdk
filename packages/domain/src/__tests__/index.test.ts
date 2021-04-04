import { hello } from '..';

test('hello', () => {
    expect(hello()).toBe(`Hello world!`);
});
