import { BotCommandBase, BotCommand } from './commands/bot-command';
import 'reflect-metadata';
import { TurnContext } from 'botbuilder';

export class BotCommandAdapter {

    private _commandTypes: typeof BotCommandBase[] = [];
    private _possibleCommands: string[] = [];
    private _commandTextParser: RegExp = null;
    private _commandMapping = {
        default: null
    }

    constructor(commandTypes: typeof BotCommandBase[]) {

        this.initCommandTypes(commandTypes);

        ///^(search\s*codes|get\s*code|help)\s*(.*)$/gim;
        this._commandTextParser = new RegExp(`^($${this._possibleCommands.join('|')})\s*(.*)$`, 'gim').compile();
    }

    private initCommandTypes(registrations: typeof BotCommandBase[]) {
        this._commandTypes = registrations;
        for (let i = 0; i < this._commandTypes.length; i++) {
            let registration = this._commandTypes[i];
            const displayName = Reflect.getMetadata('displayName', registration);
            const isDefault = Reflect.getMetadata('isDefault', registration);
            const commands = Reflect.getMetadata('commands', registration);
            let instance = (BotCommandBase.createInstance(registration));
            commands.map((command) => {
                this._commandMapping[command] = instance;
            });
            if (isDefault)
                this._commandMapping.default = instance;
            this._possibleCommands = this._possibleCommands.concat(commands);
        }
    }

    public execute(context: TurnContext, commandText: string) {
        const matches = this._commandTextParser.exec(commandText);
        let cmd: BotCommandBase = null;
        let args: string = null;

        if (!matches || matches.length < 3) {
            // We didn't find any commands that matches the commandText input, so use the default.
            cmd = this._commandMapping.default;
        } else {
            // We found a match, so grab the commandText and the arguments
            const commandText = matches[1];
            args = matches[2];
            cmd = this._commandMapping[commandText];
        }

        // Execute the command.
        cmd.execute(context, args);
    }
}