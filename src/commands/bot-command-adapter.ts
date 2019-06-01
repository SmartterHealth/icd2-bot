import { TurnContext } from 'botbuilder';
import 'reflect-metadata';
import { BotCommand, BotCommandBase } from './bot-command';

export class BotCommandAdapter {

    private _commandTypes: Array<typeof BotCommandBase> = [];
    private _possibleCommands: string[] = [];
    private _commandTextParser: string = '';
    private _commandMapping = {};

    constructor(commandTypes: Array<typeof BotCommandBase>) {

        this.initCommandTypes(commandTypes);

        /// ^(search\s*codes|get\s*code|help)\s*(.*)$/gim;
        this._commandTextParser = `^(${this._possibleCommands.join('|')})\s*(.*)$`;
    }

    public async execute(context: TurnContext, commandText: string) {
        const re = new RegExp(this._commandTextParser, 'gim');
        const matches = re.exec(commandText);
        let cmd: BotCommandBase;
        let args: string;

        if (!matches || matches.length < 3) {
            // We didn't find any commands that matches the commandText input, so use the default.
            // tslint:disable-next-line:no-string-literal
            cmd = this._commandMapping['default'];
            args = '';
        } else {
            // We found a match, so grab the commandText and the arguments
            const newCommandText = matches[1];
            args = matches[2];
            cmd = this._commandMapping[newCommandText];
        }

        // Execute the command.
        await cmd.execute(context, args);
    }

    private initCommandTypes(registrations: Array<typeof BotCommandBase>) {
        this._commandTypes = registrations;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this._commandTypes.length; i++) {
            const registration = this._commandTypes[i];
            const displayName = Reflect.getMetadata('displayName', registration);
            const isDefault = Reflect.getMetadata('isDefault', registration);
            const commands = Reflect.getMetadata('commands', registration);
            const instance: BotCommandBase = (BotCommandBase.createInstance(registration));
            commands.map((command) => {
                this._commandMapping[command] = instance;
            });
            if (isDefault) {
                if (instance != null) {
                // tslint:disable-next-line:no-string-literal
                this._commandMapping['default'] = instance; }
            }

            this._possibleCommands = this._possibleCommands.concat(commands);
        }
    }
}
