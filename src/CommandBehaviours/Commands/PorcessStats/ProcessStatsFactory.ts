import {ICommandFactory} from "../../CommandFactory";
import {NewMessageEvent} from "telegram/events";
import {ICommandHandler} from "../../ICommandHandler";
import {ProcessStats} from "./ProcessStats";
import {Context} from "../../../Context";

export class ProcessStatsFactory implements ICommandFactory {
    constructor(private ctx: Context) {
    }

    createHandler(event: NewMessageEvent, rawArguments: string[]): Promise<ICommandHandler> | ICommandHandler {
        return new ProcessStats(this.ctx, event, {});
    }

}