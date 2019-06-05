import { AdaptiveCardHelperBase } from '../AdaptiveCardHelperBase';
import { Attachment, CardFactory } from 'botbuilder';

export class GetCodeHelpAdaptiveCardHelper extends AdaptiveCardHelperBase {
    render(): Attachment {
        return CardFactory.adaptiveCard(this.card);
    }
}