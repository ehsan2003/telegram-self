import {ICommandHandler} from "../../ICommandHandler";
import {Context} from "../../../Context";
import {NewMessageEvent} from "telegram/events";

export type ProcessStopperArgs = { name: string; } | { id: string; };

export class ProcessStopper implements ICommandHandler {
    async handle(): Promise<void> {
        if ('name' in this.args) {
            this.ctx.processManager.stopByName(this.args.name);
        } else {
            this.ctx.processManager.stop(+this.args.id)
        }
    }


    constructor(private ctx: Context, private event: NewMessageEvent, private args: ProcessStopperArgs) {
    }
}