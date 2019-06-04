import { AdaptiveCardHelperBase } from '../AdaptiveCardHelperBase';
import { Attachment, CardFactory } from 'botbuilder';
import * as path from 'path';

export class HelpAdaptiveCardHelper extends AdaptiveCardHelperBase {
    renderAttachment(): Attachment {

        this.card.actions = [];
        this.card.actions.push(this.createSubmitAction({ title: 'Search Codes by Keyword(s)', data: 'help search codes'}));
        this.card.actions.push(this.createSubmitAction({ title: 'Get Code Details', data: 'help get code'}));
        this.card.actions.push(this.createSubmitAction({ title: 'Help', data: 'help'}));

        console.log(this.card);

        return CardFactory.adaptiveCard(this.card);
    }
}