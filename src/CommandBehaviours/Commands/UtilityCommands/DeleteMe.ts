import {utils} from "telegram";
import {BaseCommandHandler} from "../../BaseCommandHandler";
import yargsParser, {Arguments} from "yargs-parser";
import {MessageLike} from "../../MessageLike";
import {validateJoi} from "../../../utils";
import * as Joi from 'joi';

type DeleteMeArgs = { countToDelete: number }

export class DeleteMe extends BaseCommandHandler<DeleteMeArgs> {
    async execute(message: MessageLike, validatedArgs: DeleteMeArgs): Promise<void> {
        const messages = await this.ctx.client.getMessages(message.chatId, {
            limit: validatedArgs.countToDelete,
            fromUser: 'me',
        });
        await this.ctx.client.deleteMessages(message.chatId, messages.map(m => m.id), {});
        const chat = await this.ctx.client.getEntity(message.chatId);
        await this.ctx.common.tellUser(`deleted ${messages.length} messages from "${utils.getDisplayName(chat)}"`)
    }

    protected getArgsParserOptions(): yargsParser.Options {
        return {number: ['countToDelete'], alias: {countToDelete: ['count', 'c']}};
    }

    getHelp(): string {
        return "";
    }

    getShortHelp(): string {
        return "";
    }

    protected validateParsedArgs(parsedArgs: Arguments): DeleteMeArgs {
        return validateJoi(Joi.object({
            countToDelete: Joi.number().default(1000),
        }), parsedArgs)
    }


}