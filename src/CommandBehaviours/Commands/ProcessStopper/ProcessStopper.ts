import {ICommandHandler} from "../../ICommandHandler";
import {Context} from "../../../Context";
import {NewMessageEvent} from "telegram/events";
import {SelfError} from "../../../SelfError";
import {Arguments} from "yargs-parser";

export type ProcessStopperArgs = {
    name?: string;
    id: string;
} & Arguments;

export class ProcessStopper implements ICommandHandler {
    async handle(): Promise<void> {
        this.validateArgs();
        if (this.args.name) {
            this.ctx.processManager.stopByName(this.args.name);
        } else {
            this.ctx.processManager.stop(+this.args.id)
        }
    }

    private validateArgs() {
        if (!this.args.name && !this.args.id) {
            throw new SelfError('you must specify id or name');
        }
        if (isNaN(+this.args.id)) {
            throw new SelfError('invalid process id');
        }
    }

    constructor(private ctx: Context, private event: NewMessageEvent, private args: ProcessStopperArgs) {
    }
}