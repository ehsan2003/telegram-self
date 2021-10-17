import {ICommandHandler} from "../ICommandHandler";
import {MessageLike} from "../MessageLike";
import {Context} from "../../Context";
import {EventLoggerProcess} from "../../Processes/EventLoggerProcess";

export class EventLoggerStarter implements ICommandHandler {
    getHelp(): string {
        return "runs logger process";
    }

    getShortHelp(): string {
        return "";
    }

    async handle(messageLike: MessageLike, args: string[]): Promise<void> {
        this.ctx.processManager.run(new EventLoggerProcess(this.ctx));
    }

    constructor(protected ctx: Context) {
    }
}