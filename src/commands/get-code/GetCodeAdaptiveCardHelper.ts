import { AdaptiveCardHelperBase, CardActionType } from '../AdaptiveCardHelperBase';
import { IICD10Code } from '../IICD10Code';
import { CardFactory } from 'botbuilder';
import { Assert } from '../../assert';
import * as path from 'path';
import { TextBlock } from 'adaptivecards';

export class GetCodeAdaptiveCardHelper extends AdaptiveCardHelperBase {
    
    private _dataSource : IICD10Code;

    public get dataSource() : IICD10Code {
        return this._dataSource;
    }
    public set dataSource(value : IICD10Code) {
        Assert.isNotNull(value);
        this._dataSource = value;
    }

    public render() {
        let template = AdaptiveCardHelperBase.loadTemplate(path.join(__dirname, './GetCodeTemplate.json'));
        template.items[0].columns[1].items[0].text = this.dataSource.code
        template.items[1].columns[1].items[0].text = this.dataSource.description;
        template.items[2].columns[1].items[0].text = this.dataSource.chapter;
        this.card.body.push(template);

        const bingSearchAction = this.createAction({
            title: 'Bing Search',
            url: `https://www.bing.com/search?q=icd10 code ${this.dataSource.code}`,
            actionType: CardActionType.OpenUrl
        })
        this.card.actions = [];
        this.card.actions.push(bingSearchAction);
        return CardFactory.adaptiveCard(this.card);
    }
}