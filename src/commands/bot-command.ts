import { TurnContext } from 'botbuilder';
import 'reflect-metadata';

const registrations: Array<typeof BotCommandBase> = [];

export function BotCommand(displayName: string, commands: string[], isDefault = false ): ClassDecorator {

    // tslint:disable-next-line:ban-types
    return (target: (Function)) => {
        Reflect.defineMetadata('displayName', displayName, target);
        Reflect.defineMetadata('commands', commands, target);
        Reflect.defineMetadata('isDefault', isDefault, target);
    };
}

export abstract class BotCommandBase {

    public get displayName(): string {
        if (this._displayName === undefined) { this._displayName = Reflect.getMetadata('displayName', this.constructor) }
        return this._displayName;
    }

    public get commands(): string[] {
        if (this._commands === undefined) { this._commands = Reflect.getMetadata('commands', this.constructor) }
        return this._commands;
    }

    public get isDefault(): boolean {
        if (this._isDefault === undefined) { this._isDefault = Reflect.getMetadata('isDefault', this.constructor) }
        return this._isDefault;
    }

    public static createInstance(type: typeof BotCommandBase): BotCommandBase {
        const instance = Object.create(type.prototype);
        return instance;
    }

    private _displayName: string = undefined;
    private _commands: string[] = undefined;
    private _isDefault: boolean = undefined;

    public abstract execute(context: TurnContext, args: string);
}
