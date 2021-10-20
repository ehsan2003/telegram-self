import {SpamProcess} from "../../../Processes/Processes/SpamProcess";
import yargsParser, {Arguments} from "yargs-parser";
import {BaseCommandHandler} from "../../BaseCommandHandler";
import {MessageLike} from "../../MessageLike";
import * as Joi from 'joi';
import {validateJoi} from "../../../utils";
import {SelfError} from "../../../SelfError";

export type SpamStarterArgs = {
    chatId: number | string;
    interval: number;
    textCategory: string;
    name: string;
};

export class SpamStarter extends BaseCommandHandler<SpamStarterArgs> {
    protected async validateParsedArgs(args: Arguments) {
        return validateJoi(Joi.object({
                chatId: Joi.alternatives(Joi.number(), Joi.string()).required(),
                interval: Joi.number().default(500),
                textCategory: Joi.string().required(),
                name: Joi.string(),
            }
        ), args);
    }

    protected async execute(message: MessageLike, validatedArgs: SpamStarterArgs): Promise<void> {
        let {chatId, textCategory} = await this.prepareArguments(validatedArgs);
        const spamProcess = new SpamProcess(this.ctx, {...validatedArgs, chatId, textCategory});
        this.ctx.processManager.run(spamProcess, validatedArgs.name);
    }

    private async prepareArguments(validatedArgs: SpamStarterArgs) {
        const chat = await this.ctx.client.getEntity(validatedArgs.chatId).catch(() => null);
        if (!chat) {
            throw new SelfError('chat not found');
        }
        const category = await this.ctx.prisma.preparedTextCategory.findUnique({where: {name: validatedArgs.textCategory}});
        if (!category) {
            throw new SelfError('text category not found');
        }

        let chatId = chat.id;
        return {chatId, textCategory: category.name};
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