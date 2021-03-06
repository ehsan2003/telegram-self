import {Api, utils} from "telegram";
import {chunk} from "lodash";
import {sleep} from "telegram/Helpers";
import {BaseCommandHandler} from "../../BaseCommandHandler";
import {MessageLike} from "../../MessageLike";
import yargsParser, {Arguments} from "yargs-parser";
import {validateJoi} from "../../../utils";
import * as Joi from 'joi';

export type NotifyBaseArgs = {
    countPerMessage: number;
    delayBetweenMessages: number;
}

export abstract class NotifyBase<Validated extends NotifyBaseArgs> extends BaseCommandHandler< Validated> {
    protected async execute(message: MessageLike, validatedArgs: Validated): Promise<void> {
        const users = await this.getUsersForMention(message, validatedArgs)
        await this.notifyUsers(users, message, validatedArgs);
    }

    protected getArgsParserOptions(): yargsParser.Options {
        return {
            number: ['countPerMessage', 'delayBetweenMessages'],
            alias: {
                countPerMessage: 'c',
                delayBetweenMessages: 'd',
            }
        }
    }

    abstract getUsersForMention(message: MessageLike, args: NotifyBaseArgs): Promise<Api.User[]>;

    protected validateParsedArgs(parsedArgs: Arguments): Validated {
        return validateJoi(Joi.object({
            countPerMessage: Joi.number().default(5),
            delayBetweenMessages: Joi.number().default(1000)
        }), parsedArgs)
    }


    protected async notifyUsers(participants: Api.User[], message: MessageLike, args: Validated) {
        const chunks = chunk(participants, args.countPerMessage)
        for (const chunk of chunks) {
            await this.ctx.client.sendMessage(message.getChatId(), {
                message: this.getMessageForChunk(chunk),
                replyTo: message.getReplyToId(),
                parseMode: 'html'
            })
            await sleep(args.delayBetweenMessages);
        }
    }

    private getMessageForChunk(chunk: Api.User[]): string {
        return chunk.map(user => `<a href="tg://user?id=${user.id}">${utils.getDisplayName(user)}</a>`).join(' ')
    }
}