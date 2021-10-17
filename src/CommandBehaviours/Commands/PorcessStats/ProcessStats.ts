import {ICommandHandler} from "../../ICommandHandler";
import {Context} from "../../../Context";

export type Args = {};

export class ProcessStats implements ICommandHandler {
    constructor(private ctx: Context) {
    }

    async handle(): Promise<void> {
        await this.ctx.common.tellUser(this.ctx.processManager.getStats());
    }

    getShortHelp(): string {
        return "";
    }

    getHelp(): string {
        return "";
    }

}