import {SpamProcess, SpamProcessArgs} from "../../../Processes/SpamProcess";
import {SelfError} from "../../../SelfError";
import yargsParser, {Arguments} from "yargs-parser";
import {BaseCommandHandler} from "../../BaseCommandHandler";
import {MessageLike} from "../../MessageLike";

export type SpamStarterArgs = {
    chatId: string;
    interval: number;
    textCategory: string;
    name: string;
} & Arguments

export class SpamStarter extends BaseCommandHandler {
    protected async validateParsedArgs(args: SpamStarterArgs) {
        const chatId = isNaN(+args.chatId) ? args.chatId : +args.chatId;
        const result: Partial<SpamProcessArgs> = {}
        const chat = await this.ctx.client.getEntity(chatId).catch(() => null);
        if (!chat) {
            throw new SelfError('chat not found');
        }
        result.chatId = chat.id;
        const category = await this.ctx.prisma.preparedTextCategory.findUnique({where: {name: args.textCategory}});
        if (!category) {
            throw new SelfError('text category not found');
        }
        result.textCategory = category.name;
        result.interval = args.interval;
        return result as SpamProcessArgs;
    }

    protected async execute(message: MessageLike, validatedArgs: any): Promise<void> {
        const spamProcess = new SpamProcess(this.ctx, validatedArgs);
        this.ctx.processManager.run(spamProcess, validatedArgs.name);
    }

    protected getArgsParserOptions(): yargsParser.Options {
        return {
            number: ['interval'],
            string: ['chatId', 'textCategory', 'name'],
            alias: {interval: 'i', textCategory: 't', chatId: 'c'},
            default: {
                interval: 1000,
            }
        };
    }

    getHelp(): string {
        return "";
    }

    getShortHelp(): string {
        return "";
    }

}