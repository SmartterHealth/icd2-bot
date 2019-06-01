import { AdaptiveCard, Column, ColumnSet, Container, SubmitAction, TextBlock, TextWeight, VerticalAlignment} from 'adaptivecards';
import { Attachment, CardFactory } from 'botbuilder';
import { AdaptiveCardHelper as ach } from '../adaptive-card-helper';
import { IICD10Code, IICD10SearchResults } from '../IICD10Code';

export class SearchAdaptiveCard {
    public get maxResultsRendered(): number {
        return this._maxResultsRendered;
    }
    public set maxResultsRendered(v: number) {
        this._maxResultsRendered = v;
    }

    private _maxResultsRendered: number;

    private card: AdaptiveCard;

    constructor(maxResultsRendered: number = 50) {
        this.maxResultsRendered = maxResultsRendered;
    }

    public renderAttachment(searchResults: IICD10SearchResults): Attachment {
        if (this.card === null) {
            this.card = new AdaptiveCard();

            this.createHeader(this.card);

            this.card.addItem(ach.createContainer([
                ach.createTextBlock(`${searchResults.codes.length} items returned.`),
            ]));

            this.createSearchResultTable(this.card);
        }

        this.addRows(searchResults.codes);

        return ach.renderAttachment(this.card);
    }

    private addRow(icd10Code: IICD10Code): void {

        const cs: ColumnSet = ach.createColumnSet([
            ach.createColumn(ach.createTextBlock(icd10Code.code), 'auto'),
            ach.createColumn(ach.createTextBlock(icd10Code.description), 'auto'),
        ]);
        cs.selectAction = ach.createSubmitAction(icd10Code.code, `get code ${icd10Code.code}`);

        this.card.addItem(cs);
    }

    private addRows(icd10Codes: IICD10Code[]) {
        icd10Codes.map((icd10Code) => {
            this.addRow(icd10Code);
        });
    }

    private createHeader(card: AdaptiveCard) {
        card.addItem(
            ach.createColumnSet([
                ach.createColumn(ach.createImage('https://i.imgur.com/YAmuJGY.jpg?1')),
                ach.createColumn(ach.createTextBlock('search codes')),
            ]),
        );
    }

    private createSearchResultTable(card: AdaptiveCard) {

        const cc: Column = new Column('stretch');
        cc.addItem(ach.createTextBlock('Code', TextWeight.Bolder));

        const cd: Column = new Column('stretch');
        cd.addItem(ach.createTextBlock('Description', TextWeight.Bolder));

        const cs: ColumnSet = ach.createColumnSet([cc, cd]);

        card.addItem(cs);
    }
}

// tslint:disable-next-line:max-classes-per-file
