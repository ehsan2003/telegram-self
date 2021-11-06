import {BaseCommandHandler} from "../../BaseCommandHandler";

import {MessageLike} from "../../MessageLike";
import yargsParser from "yargs-parser";
import {validateJoi} from "../../../utils";
import * as Joi from 'joi';
import {SelfError} from "../../../SelfError";
import {Api} from "telegram";

export type AddGroupMemArgs = {
    groupName: string;
}

export class AddGroupMem extends BaseCommandHandler<AddGroupMemArgs> {
    protected async execute(message: MessageLike, validatedArgs: AddGroupMemArgs): Promise<void> {
        const group = await this.ctx.prisma.userGroup.findUnique({where: {name: validatedArgs.groupName}});
        if (!group) {
            throw new SelfError('group name does not exists');
        }
        const users = await this.getUsersToAdd(message);
        if (!users.length) {
            throw new SelfError('the message must have a reply to a user or reply to a user\'s message');
        }
        await this.addUsersToDb(users, group.name);
    }

    private async addUsersToDb(users: Api.User[], groupId: string) {
        for (const user of users) {
            await this.ctx.prisma.userGroupMember.upsert({
                where: {groupId_userId: {userId: user.id, groupId: groupId}},
                update: {},
                create: {
                    group: {connect: {name: groupId}},
                    userId: user.id,
                    accessHash: user.accessHash!.toString()
                },
            })
        }
    }

    private async getUsersToAdd(message: MessageLike) {
        const replyUser = await this.getReplyUser(message);
        const usersToAdd = await message.getMentionedUsers();
        if (replyUser) {
            usersToAdd.push(replyUser);
        }
        return usersToAdd;
    }

    private async getReplyUser(message: MessageLike): Promise<Api.User | undefined> {
        const reply = await message.getReplyTo();
        if (!reply) {
            return undefined;
        }
        return await this.ctx.client.getEntity(reply.fromId!) as Api.User;

    }

    protected getArgsParserOptions(): yargsParser.Options {
        return {}
    }

    getHelp(): string {
        return "";
    }

    getShortHelp(): string {
        return "";
    }

    protected validateParsedArgs(parsedArgs: yargsParser.Arguments): Promise<AddGroupMemArgs> | AddGroupMemArgs {
        return validateJoi(Joi.object({
            groupName: Joi.string().required(),
        }), {
            groupName: parsedArgs._[0]
        });
    }

}