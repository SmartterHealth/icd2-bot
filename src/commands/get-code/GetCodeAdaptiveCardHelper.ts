import { AdaptiveCardHelperBase, CardActionType } from '../AdaptiveCardHelperBase';
import { IICD10Code } from '../IICD10Code';
import { CardFactory, Attachment } from 'botbuilder';
import { Assert } from '../../assert';
import * as path from 'path';

export class GetCodeAdaptiveCardHelper extends AdaptiveCardHelperBase {
    
    private _dataSource : IICD10Code;

    public get dataSource() : IICD10Code {
        return this._dataSource;
    }
    public set dataSource(value : IICD10Code) {
        Assert.isNotNull(value);
        this._dataSource = value;
    }

    public render(): Attachment {
        this.renderCore();
        this.renderBingSearch();

        return CardFactory.adaptiveCard(this.card);
    }

    /**
     * Renders the main part of the adaptive card.
     */
    private renderCore() {

        // Load the JSON template, and set code, description, and chapter.
        let template = AdaptiveCardHelperBase.loadCardElementJSON(path.join(__dirname, './GetCodeAdaptiveCardHelper.json'));
        template.items[0].columns[1].items[0].text = this.dataSource.code;
        template.items[1].columns[1].items[0].text = this.dataSource.description;
        template.items[2].columns[1].items[0].text = this.dataSource.chapter;

        // Append to the card's body.
        this.card.body.push(template);
    }

    /**
     * Renders the Bing Search button, which will execute a Bing query for the specified ICD10 code.
     */
    private renderBingSearch() {

        // Create the action button.
        const bingSearchAction = this.createAction({
            title: 'Open in Bing Search',
            url: `https://www.bing.com/search?q=icd10 code ${this.dataSource.code}`,
            actionType: CardActionType.OpenUrl,
            iconUrl: 'https://i.imgur.com/oV6TgTL.png'
        });

        // Create the actions array and and the action button.
        this.card.actions = [];
        this.card.actions.push(bingSearchAction);
    }
}