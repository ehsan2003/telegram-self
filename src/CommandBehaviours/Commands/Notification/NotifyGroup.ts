import {NotifyBase, NotifyBaseArgs} from "./Notify.base";
import {MessageLike} from "../../MessageLike";
import {Api} from "telegram";
import {validateJoi} from "../../../utils";
import * as Joi from "joi";
import yargsParser, {Arguments} from "yargs-parser";


export type NotifyGroupArgs = { groupName: string; } & NotifyBaseArgs;

export class NotifyGroup extends NotifyBase<NotifyGroupArgs> {
    getHelp(): string {
        return "";
    }

    getShortHelp(): string {
        return "";
    }

    protected validateParsedArgs(parsedArgs: Arguments): NotifyGroupArgs {
        return validateJoi(Joi.object({
            groupName: Joi.string().required(),
            countPerMessage: Joi.number().min(2).default(5),
            delayBetweenMessages: Joi.number().default(1000)
        }), parsedArgs);
    }

    getArgsParserOptions(): yargsParser.Options {
        return {
            string: ['groupName'],
            number: ['countPerMessage', 'delayBetweenMessages'],
            alias: {
                delayBetweenMessages: 'd',
                groupName: 'g',
                countPerMessage: 'c',
            }
        }
    }

    async getUsersForMention(message: MessageLike, args: NotifyGroupArgs): Promise<Api.User[]> {
        return this.ctx.common.getUserGroupMembersInChat(message.chatId, args.groupName);
    }

}