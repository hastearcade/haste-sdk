const world = 'world';

export function hello(word: string = world): string {
    console.log('test2');
    return `Hello ${word}!`;
}
