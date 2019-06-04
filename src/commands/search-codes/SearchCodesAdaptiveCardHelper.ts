import { Attachment, CardFactory, TurnContext } from 'botbuilder';
import { IICD10Code, IICD10SearchResults } from '../IICD10Code';
import { Assert } from '../../assert';
import { AdaptiveCardHelperBase } from '../AdaptiveCardHelperBase';
import * as path from 'path';

export class SearchCodesAdaptiveCardHelper extends AdaptiveCardHelperBase {

    private _maxResults: number;

    public get maxResults(): number {
        return this._maxResults;
    }
    public set maxResults(v: number) {
        this._maxResults = v;
    }

    public renderAttachment(results: IICD10SearchResults): Attachment {

        results.codes.map((result) => {
            let template = SearchCodesAdaptiveCardHelper.loadTemplate(path.join(__dirname, './searchCodesTemplate.json'));
            let root = template.items[0];
            root.columns[0].items[0].text = result.code;
            root.columns[1].items[0].text = result.description;

            const getCodeCommand = `get code ${this.args}`;
            root.selectAction.data = this.submitAction(getCodeCommand);
            this.card.body.push(template);
        })

        return CardFactory.adaptiveCard(this.card);
    }
}