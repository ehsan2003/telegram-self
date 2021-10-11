import {CommandHandlerBase} from "./CommandHandler.base";
import {CommandHandlerFactory} from "./CommandHandlerFactory.base";
import {NewMessageEvent} from "telegram/events";
import yargs from "yargs";
import {SpamProcess} from "../../Processes/SpamProcess";

export type Args = {
    interval: number;
    textCategory: string;
    chat: number;
};

export class SpamStartHandler extends CommandHandlerBase<Args> {
    protected async execute(): Promise<void> {
        this.ctx.processManager.run(new SpamProcess(this.ctx, this.args))
    }
}

export class SpamStartHandlerFactory extends CommandHandlerFactory {
    createInstance(event: NewMessageEvent, args: yargs.Arguments<Args>): Promise<CommandHandlerBase<any>> {
        return Promise.resolve(new SpamStartHandler(this.ctx, event, args));
    }

    protected getArgumentParser(): yargs.Argv<Args> {
        return yargs
            .option('interval', {alias: 'i', default: 500, number: true,})
            .option('textCategory', {alias: 't', string: true, demandOption: true})
            .option('chat', {alias: 'c', number: true, demandOption: true})
    }

    protected getName(): string {
        return "spam";
    }

}