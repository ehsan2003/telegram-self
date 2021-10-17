import {NotifyBase, NotifyBaseArgs} from "../Notify.base";
import {MessageLike} from "../../MessageLike";
import {Api} from "telegram";
import {validateJoi} from "../../../utils";
import * as Joi from "joi";
import yargsParser from "yargs-parser";
import {SelfError} from "../../../SelfError";
import {intersectionBy} from "lodash";


export type NotifyGroupArgs = { groupName: string; } & NotifyBaseArgs;

export class NotifyGroup extends NotifyBase<NotifyGroupArgs, NotifyGroupArgs> {
    getHelp(): string {
        return "";
    }

    getShortHelp(): string {
        return "";
    }

    protected validateParsedArgs(parsedArgs: NotifyGroupArgs): NotifyGroupArgs {
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
        const group = await this.ctx.prisma.userGroup.findUnique({where: {name: args.groupName}});
        if (!group) {
            throw new SelfError('group does not exists');
        }
        const groupMembers = await this.ctx.prisma.userGroupMember.findMany({where: {groupId: group.id}})
        const participants = await this.ctx.client.getParticipants(message.chatId, {});
        return intersectionBy(participants, groupMembers, (v) => 'userId' in v ? v.userId : v.id);
    }

}