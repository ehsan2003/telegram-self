import {ICommandHandler} from "../../ICommandHandler";
import {Context} from "../../../Context";
import {NewMessageEvent} from "telegram/events";

export type Args = {};

export class ProcessStats implements ICommandHandler {
    constructor(private ctx: Context, private event: NewMessageEvent, private args: Args) {
    }

    async handle(): Promise<void> {
        await this.ctx.common.tellUser(this.ctx.processManager.getStats());
    }

}