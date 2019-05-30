import { AdaptiveCard, Column, ColumnSet, Container, SubmitAction, TextBlock, TextWeight, VerticalAlignment, OpenUrlAction} from 'adaptivecards';
import { Attachment, CardFactory } from 'botbuilder';
import { AdaptiveCardHelper as ach } from '../adaptive-card-helper';
import { IICD10Code } from '../IICD10Code';

export class GetCodeAdaptiveCard {

    private card: AdaptiveCard = null;

    public renderAttachment(code: IICD10Code): Attachment {
        if (this.card === null) {
            this.card = new AdaptiveCard();

            this.card.addAction(ach.createUrlAction(`https://www.bing.com/search?q=icd10 code ${code.code}`, 'Open in Bing Search'));

            this.createHeader(this.card);

            this.card.addItem(ach.createContainer([
                ach.createTextBlock(`**Code:** ${code.code}`),
                ach.createTextBlock(`**Description:** ${code.description}`),
                ach.createTextBlock(`**Chapter:** ${code.chapter}`),
            ]));
        }
        return ach.renderAttachment(this.card);
    }

    private createHeader(card: AdaptiveCard) {
        card.addItem(
            ach.createColumnSet([
                ach.createColumn(ach.createImage('https://i.imgur.com/YAmuJGY.jpg')),
                ach.createColumn(ach.createTextBlock('get code', TextWeight.Bolder)),
            ]),
        );
    }
}

// tslint:disable-next-line:max-classes-per-file
