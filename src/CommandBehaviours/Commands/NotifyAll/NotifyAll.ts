import {NotifyBase, NotifyBaseArgs} from "../Notify.base";
import {MessageLike} from "../../MessageLike";
import {Api} from "telegram";


export class NotifyAll extends NotifyBase<any, any> {
    getHelp(): string {
        return "";
    }

    getShortHelp(): string {
        return "";
    }

    getUsersForMention(message: MessageLike, args: NotifyBaseArgs): Promise<Api.User[]> {
        console.log('cid',message.chatId);
        return this.ctx.client.getParticipants(message.chatId, {});
    }

}