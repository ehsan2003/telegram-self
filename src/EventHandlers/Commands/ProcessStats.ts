import {CommandHandlerBase} from "./CommandHandler.base";
import {CommandHandlerFactory} from "./CommandHandlerFactory.base";
import yargs from "yargs";
import {NewMessageEvent} from "telegram/events";

export type Args = {};

export class ProcessStatsHandler extends CommandHandlerBase<Args> {
    protected async execute(): Promise<void> {
        await this.ctx.common.sendError(this.ctx.processManager.getStats())
    }
}

export class ProcessStatsHandlerFactory extends CommandHandlerFactory {
    createInstance(event: NewMessageEvent, args: yargs.Arguments<Args>): Promise<CommandHandlerBase<any>> {
        return Promise.resolve(new ProcessStatsHandler(this.ctx, event, args));
    }

    protected getArgumentParser(): yargs.Argv {
        return yargs([]);
    }

    protected getName(): string {
        return "pstat";
    }

}