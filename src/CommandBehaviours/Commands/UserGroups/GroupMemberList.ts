import {ICommandHandler} from "../../ICommandHandler";
import {Context} from "../../../Context";
import {MessageLike} from "../../MessageLike";
import {SelfError} from "../../../SelfError";
import {Api, utils} from "telegram";
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
        const users = await this.ctx.common.getUserGroupMembersInChat(messageLike.getChatId(), groupName);
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