import {CommandHandlerBase} from "./CommandHandler.base";
import {CommandHandlerFactory} from "./CommandHandlerFactory.base";
import yargs from "yargs";
import {NewMessageEvent} from "telegram/events";
import {SelfError} from "../../SelfError";

export type Args = {
    name?: string;
    id?: number;
}

export class ProcessStopHandler extends CommandHandlerBase<Args> {
    protected execute(): Promise<void> {
        if (this.args.name) {
            this.ctx.processManager.stopByName(this.args.name)
        } else if (this.args.id !== undefined) {
            this.ctx.processManager.stop(this.args.id);
        } else {
            throw new SelfError('you must specify either name or id for stopping a process');
        }
        return Promise.resolve(undefined);
    }
}

export class ProcessStopHandlerFactory extends CommandHandlerFactory {
    createInstance(event: NewMessageEvent, args: yargs.Arguments<Args>): Promise<CommandHandlerBase<any>> {
        return Promise.resolve(new ProcessStopHandler(this.ctx, event, args));
    }

    protected getArgumentParser(): yargs.Argv<Args> {
        return yargs
            .option('name', {alias: 'n', string: true})
            .option('id', {alias: 'i', number: true})
    }

    protected getName(): string {
        return "stop";
    }

}