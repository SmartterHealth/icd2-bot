import { Attachment, CardFactory, TurnContext } from 'botbuilder';
import { IICD10Code, IICD10SearchResults } from '../IICD10Code';
import { Assert } from '../../assert';
import { AdaptiveCardHelperBase, CardActionType } from '../AdaptiveCardHelperBase';
import * as path from 'path';

export class SearchCodesAdaptiveCardHelper extends AdaptiveCardHelperBase {

    private _dataSource : IICD10SearchResults;

    public get dataSource() : IICD10SearchResults {
        return this._dataSource;
    }

    public set dataSource(searchResults : IICD10SearchResults) {
        Assert.isNotNull(searchResults);
        this._dataSource = searchResults;
    }

    public render(): Attachment {
        this.renderSearchResults();
        return CardFactory.adaptiveCard(this.card);
    }

    private renderSearchResults() {
        this.dataSource.codes.map((result) => {
            let template = SearchCodesAdaptiveCardHelper.loadTemplate(path.join(__dirname, './SearchCodesAdaptiveCardHelper.json'));
            let root = template.items[0];
            root.columns[0].items[0].text = result.code;
            root.columns[1].items[0].text = result.description;
            root.selectAction = this.createAction({ title: result.code, actionType: CardActionType.Submit, data: `get code ${result.code}` });
            this.card.body.push(template);
        });
    }

    public renderAttachment(results: IICD10SearchResults): Attachment {

        results.codes.map((result) => {
            let template = SearchCodesAdaptiveCardHelper.loadTemplate(path.join(__dirname, './SearchCodesTemplate.json'));
            let root = template.items[0];
            root.columns[0].items[0].text = result.code;
            root.columns[1].items[0].text = result.description;

            root.selectAction = this.createAction({title: result.code, actionType: CardActionType.Submit, data: `get code ${result.code}` });
            this.card.body.push(template);
        })

        return CardFactory.adaptiveCard(this.card);
    }
}