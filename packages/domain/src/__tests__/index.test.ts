import { hello } from '..';

test('hello', () => {
    expect(hello()).toBe(`Hello world!`);
});

test('hello world2', () => {
    expect(hello('world2')).toBe(`not my world`);
});
