const world = 'world';

export function hello(word: string = world): string {
    if (word === 'world2') {
        return 'not my world';
    }

    return `Hello ${word}!`;
}
