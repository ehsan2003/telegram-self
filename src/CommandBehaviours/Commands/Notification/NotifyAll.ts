import {NotifyBase, NotifyBaseArgs} from "./Notify.base";
import {MessageLike} from "../../MessageLike";
import {Api} from "telegram";


export class NotifyAll extends NotifyBase<any> {
    getHelp(): string {
        return "";
    }

    getShortHelp(): string {
        return "";
    }

    getUsersForMention(message: MessageLike, args: NotifyBaseArgs): Promise<Api.User[]> {
        return this.ctx.client.getParticipants(message.chatId, {});
    }

}