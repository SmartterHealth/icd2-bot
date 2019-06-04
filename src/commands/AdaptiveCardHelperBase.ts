import { TurnContext } from "botbuilder";
import { Assert } from "../assert";
import * as path from 'path';

export abstract class AdaptiveCardHelperBase {
    
    constructor(context: TurnContext) {
        Assert.isNotNull<TurnContext>(context, TurnContext);
        this.context = context;
    }

    private _card = AdaptiveCardHelperBase.loadTemplate(path.join(__dirname, './AdaptiveCardTemplate.json'));

    protected get card() {
        return this._card;
    }

    private _args: string;

    public get args(): string {
        return this._args;
    }

    public set args(value: string) {
        this._args = value;
    }

    private _context: TurnContext;

    public get context(): TurnContext {
        return this._context;
    }
    public set context(v: TurnContext) {
        this._context = v;
    }

    public get headerDescription(): string {
        return this.card.body[1].items[0].text.text;
    }
    public set headerDescription(v: string) {
        this.card.body[1].items[0].text = v;
    }

    public get headerTitle(): string {
        return this.card.body[0].items[0].columns[1].items[0].text;
    }
    public set headerTitle(v: string) {
        this.card.body[0].items[0].columns[1].items[0].text = v;
    }

    public get isMSTeams(): boolean {
        return (this.context != null && this.context.activity.value != null && this.context.activity.value.msteams != undefined)
    }

    protected createSubmitAction(options: ICardAction) {
        let action: any = Object.assign({}, options);
        action.type = 'Action.Submit';

        return action;
    }

    protected submitAction(data: any, text?: string, displayText?: string) {

        let action = {
            type: 'Action.Submit',
            text: text,
            data: data
        }

        if(this.isMSTeams == true) {
            action.data = {
                msteams: {
                    "type": "messageBack",
                    "text": text,
                    "displayText": displayText,
                    "value": data
                }
            }
        }

        return action;
    }

    public static loadTemplate(path: string): any {
        return JSON.parse(JSON.stringify(require(path)));
    }
}

interface ICardAction {
    title: string,
    data: any
}