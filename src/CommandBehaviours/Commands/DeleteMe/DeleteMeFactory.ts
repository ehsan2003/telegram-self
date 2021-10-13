import {ICommandFactory} from "../../CommandFactory";
import {ICommandHandler} from "../../ICommandHandler";
import {NewMessageEvent} from "telegram/events";
import {DeleteMe} from "./DeleteMe";
import {Context} from "../../../Context";

export class DeleteMeFactory implements ICommandFactory {
    createHandler(event: NewMessageEvent, rawArguments: string[]): Promise<ICommandHandler> | ICommandHandler {
        return new DeleteMe(this.ctx, event, isNaN(+rawArguments[0]) ? 1000 : +rawArguments[0]);
    }

    constructor(private ctx: Context) {
    }

}