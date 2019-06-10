import { TurnContext } from 'botbuilder';
import 'reflect-metadata';

/**
 * Class decorator that exposes command metadata to the BotCommandAdapter.
 * @param displayName The friendly name for the command.
 * @param commands A list of aliases for the command.
 * @param isDefault A flag that indicates whether the command is the default command.
 */
export function BotCommand(displayName: string, commands: string[], isDefault = false ): ClassDecorator {

    // tslint:disable-next-line:ban-types
    return (target: (Function)) => {
        // Add class metadata. For more information on TypeScript decorators, please see https://aka.ms/tsdecorators.
        Reflect.defineMetadata('displayName', displayName, target);
        Reflect.defineMetadata('commands', commands, target);
        Reflect.defineMetadata('isDefault', isDefault, target);
    };
}

/**
 * Base class that implements shared command handler properties and behavior.
 */
export abstract class BotCommandBase {

    /** Gets the friendly name for the command. */
    public get displayName(): string {
        if (this._displayName === undefined) { this._displayName = Reflect.getMetadata('displayName', this.constructor) }
        return this._displayName;
    }

    /** Gets a list of aliases for the command. */
    public get commands(): string[] {
        if (this._commands === undefined) { this._commands = Reflect.getMetadata('commands', this.constructor) }
        return this._commands;
    }

    /** Gets a flag that indicates whether the command is the default command. */
    public get isDefault(): boolean {
        if (this._isDefault === undefined) { this._isDefault = Reflect.getMetadata('isDefault', this.constructor) }
        return this._isDefault;
    }

    /**
     * Factory method that creates a new command based on the type argument.
     * @param type The type of command to create.
     */
    public static createInstance(type: typeof BotCommandBase): BotCommandBase {
        const instance = Object.create(type.prototype);
        return instance;
    }

    /** Private field that stores the friendly name for the command.  */
    private _displayName: string;
    /** Private field that stores a list of aliases for the command. */
    private _commands: string[];
    /** Private field that stores a flag that indicates whether the command is the default command. */
    private _isDefault: boolean;

    /**
     * Executes the command.
     * @param context A TurnContext instance containing all the data needed for processing this conversation turn.
     * @param args The arguments send to the command.
     */
    public abstract execute(context: TurnContext, args: string);
}
