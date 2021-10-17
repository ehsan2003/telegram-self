import {NotifyBase, NotifyBaseArgs} from "../Notify.base";
import {Api} from "telegram";
import {MessageLike} from "../../MessageLike";

export class NotifyAdmins extends NotifyBase<any, any> {
    getAdmins(groupId: number) {
        return this.ctx.client.getParticipants(groupId, {filter: new Api.ChannelParticipantsAdmins()});
    }

    getHelp(): string {
        return "mentions admins of a group";
    }

    getShortHelp(): string {
        return "";
    }

    getUsersForMention(message: MessageLike, args: NotifyBaseArgs): Promise<Api.User[]> {
        return this.getAdmins(message.chatId);
    }
}