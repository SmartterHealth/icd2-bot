import * as ac from 'adaptivecards';
import { TurnContext } from 'botbuilder';
import { Assert } from '../../assert';
import { AdaptiveCardHelperBase } from '../adaptive-card-helper-base';

export class HelpAdaptiveCardHelper extends AdaptiveCardHelperBase {
    constructor(context: TurnContext) {

        super(context);

        this.headerTitle = 'ICD2-Bot Help';

    }
}
