import {ICommandHandler} from "../../ICommandHandler";
import BigInteger from 'big-integer';

import {Context} from "../../../Context";
import {MessageLike} from "../../MessageLike";
import {SelfError} from "../../../SelfError";
import {Api, utils} from "telegram/gramjs";
import {table} from "table";

export class GroupMemberList implements ICommandHandler {
    getHelp(): string {
        return "";
    }

    getShortHelp(): string {
        return "";
    }

    async handle(messageLike: MessageLike, args: string[]): Promise<void> {
        const groupName = args[0];
        if (!groupName) {
            throw new SelfError('you must specify a group name');
        }
        const groupMembers = await this.ctx.prisma.userGroupMember.findMany({where: {group: {name: groupName}}});

        const users = await this.ctx.client.invoke(new Api.users.GetUsers({
            id: groupMembers.map(m => new Api.InputPeerUser({
                userId: m.userId,
                accessHash: BigInteger(m.accessHash.toString())
            }))
        })) as Api.User[];
        if (!users.length) {
            throw new SelfError(`no users found in this chat that belongs to ${groupName}`);
        }
        const data = this.formatData(users, groupName);
        await this.ctx.common.tellUser(data);

    }


    private formatData(users: Api.User[], groupName: string) {
        return table([['username', 'name', 'group name'], ...users.map(u => [u.username || '-', utils.getDisplayName(u), groupName])]);
    }

    constructor(private ctx: Context) {
    }

}