import { TurnContext } from 'botbuilder';

export class Assert {
    public static isNotNull<T>(value: T, x?: T&any) {
        if (x === undefined) { x = { name: 'any' }; }
        if (value === null || value === undefined) {
            throw new Error(`Argument of type '${x.name}' cannot be null!`);
        }
    }
}
