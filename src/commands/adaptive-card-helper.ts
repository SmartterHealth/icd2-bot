import { AdaptiveCard, CardElement, Column, ColumnSet, ColumnWidth, Container, Image, Size, SubmitAction, TextBlock, TextWeight, VerticalAlignment} from 'adaptivecards';
import { Attachment, CardFactory } from 'botbuilder';

export type ColumnItems = CardElement | CardElement[];
export type ContainerItems = CardElement | CardElement[];

export class AdaptiveCardHelper {

    public static renderAttachment(card: AdaptiveCard): Attachment {
        return CardFactory.adaptiveCard(card);
    }

    public static createContainer(items: ContainerItems): Container {
        const cont = new Container();

        if (Array.isArray(items)) {
            items.map((item) => {
                cont.addItem(item);
            });
        } else {
            cont.addItem(items);
        }

        return cont;
    }

    public static createTextBlock( text: string, weight: TextWeight = TextWeight.Default): TextBlock {
        const tb = new TextBlock();
        tb.text = text;
        tb.weight = weight;

        return tb;
    }

    public static createColumn(items: ColumnItems, width: ColumnWidth = 'stretch', verticalAlign: VerticalAlignment = VerticalAlignment.Center): Column {
        const col = new Column();
        col.width = width;
        col.verticalContentAlignment = verticalAlign;
        if (Array.isArray(items)) {
            items.map((item) => {
                col.addItem(item);
            });
        } else {
            col.addItem(items);
        }

        return col;
    }

    public static createColumnSet(columns?: Column[]) {
        const cs = new ColumnSet();

        if (columns != null) {
            columns.map((column) => {
                cs.addColumn(column);
            });
        }

        return cs;
    }

    public static createSubmitAction(title: string, data: string): SubmitAction {
        const sa: SubmitAction = new SubmitAction();
        sa.title = title;
        sa.data = data;

        return sa;
    }

    public static createImage(url: string, size: Size = Size.Small): Image {
        const img = new Image();
        img.url = url;
        img.size = size;

        return img;
    }
}
