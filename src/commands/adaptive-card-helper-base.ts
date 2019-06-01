import * as ac from 'adaptivecards';
import { Attachment, CardFactory, TurnContext } from 'botbuilder';
import { Assert } from '../assert';
import { ITextBlockOptions } from './adaptive-card-helper-base';
import { AdaptiveCard } from 'adaptivecards';

export declare type ColumnItems = ac.CardElement | ac.CardElement[];
export declare type ContainerItems = ac.CardElement | ac.CardElement[];

export abstract class AdaptiveCardHelperBase {

    protected get context(): TurnContext {
        return this._context;
    }

    protected get card(): ac.AdaptiveCard {
        if (this._card == null) { this._card = new AdaptiveCard(); }
        return this._card;
    }

    private _card: ac.AdaptiveCard;

    private _headerContainer: ac.Container;
    private _headerTitleTextBlock: ac.TextBlock;
    private _headerColumnSet: ac.ColumnSet;
    private _headerImage: ac.Image;
    private _headerDescriptionTextBlock: ac.TextBlock;

    private _context: TurnContext;

    constructor(context: TurnContext) {
        Assert.isNotNull<TurnContext>(context);
        this._context = context;
        this._card = new ac.AdaptiveCard();
        this._initHeader();
    }

    public createColumn(items?: ColumnItems, options?: IColumnOptions): ac.Column {

        const mergedOptions = Object.assign({}, (options == null)
            ? {
                verticalContentAlignment: ac.VerticalAlignment.Center,
            }
            : options);

        const column = Object.assign(new ac.Column(), mergedOptions);

        if (items != null && items !== undefined) {
            if (Array.isArray(items)) {
                items.map((item) => {
                    column.addItem(item);
                });
            } else {
                column.addItem(items);
            }
        }

        return column;
    }

    public createColumnSet(columns?: ac.Column[]) {
        const cs = new ac.ColumnSet();

        if (columns != null) {
            columns.map((column) => {
                cs.addColumn(column);
            });
        }

        return cs;
    }
    public createContainer(items: ContainerItems): ac.Container {
        Assert.isNotNull<ContainerItems>(items, ac.CardElement);
        const container = new ac.Container();

        if (Array.isArray(items)) {
            items.map((item) => {
                container.addItem(item);
            });
        } else {
            container.addItem(items);
        }

        return container;
    }

    public createImage(value: string | IImageOptions): ac.Image {

        Assert.isNotNull(value);
        if (typeof value === 'string') { value = { url: value }; }
        const img = Object.assign(new ac.Image(), value);
        return img;

    }

    public createTextBlock(value: string | ITextBlockOptions): ac.TextBlock {

        Assert.isNotNull(value);
        if (typeof value === 'string') { value = { text: value, wrap: true }; }
        const tb = Object.assign(new ac.TextBlock(), value);

        return tb;

    }

    public renderAsAttachment(): Attachment {
        return CardFactory.adaptiveCard(this._card);
    }

    public setHeaderDescription(text: string) {
        this._headerDescriptionTextBlock.text = text;
    }

    public setHeaderTitle(text: string) {
        this._headerTitleTextBlock.text = text;
    }

    public setHeaderImage(url: string) {
        this._headerImage.url = url;
    }

    private _initHeader(): void {
        this._headerTitleTextBlock = this.createTextBlock('[TITLE]');
        this._headerImage = this.createImage({
            url: 'https://i.imgur.com/YAmuJGY.jpg?1',
            size: ac.Size.Small,
        });

        this._headerColumnSet = this.createColumnSet([
            this.createColumn(this._headerImage),
            this.createColumn(this._headerTitleTextBlock),
        ]);

        this._headerDescriptionTextBlock = this.createTextBlock('DESCRIPTION');

        this._headerContainer = this.createContainer([this._headerColumnSet, this._headerDescriptionTextBlock]);

        this._card.addItem(this._headerContainer);

    }

    public get headerTitle() : string {
        return this._headerTitleTextBlock.text;
    }
    public set headerTitle(text : string) {
        Assert.isNotNull<string>(text, String);
        this._headerTitleTextBlock.text = text;
    }
}

// tslint:disable-next-line:max-classes-per-file
export interface IColumnOptions {
    backgroundImage?: ac.BackgroundImage;
    verticalContentAlignment?: ac.VerticalAlignment;
    width?: ac.ColumnWidth;
}

export interface IImageOptions {
    url: string;
    style?: ac.ImageStyle;
    backgroundColor?: string;
    size?: ac.Size;
    pixelWidth?: number;
    pixelHeight?: number;
    altText?: string;
}

export interface ITextBlockOptions {
    text: string;
    weight?: ac.TextWeight;
    size?: ac.TextSize;
    color?: ac.TextColor;
    isSubtle?: boolean;
    wrap?: boolean;
    maxLines?: number;
    useMarkdown?: boolean;
}
