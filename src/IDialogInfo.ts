import { Dialog } from 'botbuilder-dialogs';

/**
 * 
 */
export interface IDialogInfo {
    id:string,
    name: string,
    action: Dialog,
    pattern: any;
}