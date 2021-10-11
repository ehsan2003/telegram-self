import {CommandHandlerBase} from "./CommandHandler.base";
import {CommandHandlerFactory} from "./CommandHandlerFactory.base";
import {NewMessageEvent} from "telegram/events";
import yargs from "yargs";
import {Args as SpamProcessArgs, SpamProcess} from "../../Processes/SpamProcess";
import {SelfError} from "../../SelfError";

export type Args = {
    interval: number;
    textCategory: string;
    chat: string;
    name?: string;
};

export class SpamStartHandler extends CommandHandlerBase<Args> {
    protected async execute(): Promise<void> {
        const sanitizedArguments = await this.validateAndSanitizeArgumentsOrThrow();
        this.ctx.processManager.run(new SpamProcess(this.ctx, sanitizedArguments), this.args.name);
    }

    private async validateAndSanitizeArgumentsOrThrow(): Promise<SpamProcessArgs> {
        let chatResolver: number | string = this.args.chat;
        if (!isNaN(+this.args.chat)) {
            chatResolver = +this.args.chat;
        }

        const chat = await this.ctx.client.getEntity(chatResolver).catch(() => null);
        if (!chat) {
            throw new SelfError('chat not found');
        }

        const textCategory = await this.ctx.prisma.preparedTextCategory.findFirst({where: {name: this.args.textCategory}});
        if (!textCategory) {
            throw new SelfError('text category not found');
        }

        return {...this.args, chat: chat.id};

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
            .option('chat', {alias: 'c', string: true, demandOption: true,})
            .option('name', {alias: 'n', string: true, demandOption: false})
    }

    protected getName(): string {
        return "spam";
    }

}