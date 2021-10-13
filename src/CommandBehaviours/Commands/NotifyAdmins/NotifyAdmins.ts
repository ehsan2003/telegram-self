import {NotifyBase, NotifyBaseArgs} from "../Notify.base";
import {ICommandHandler} from "../../ICommandHandler";
import {Api} from "telegram";

export type NotifyAdminsArgs = {} & NotifyBaseArgs;

export class NotifyAdmins extends NotifyBase implements ICommandHandler {
    async handle(): Promise<void> {
        await this.notifyUsers(await this.getAdmins());
    }

    getAdmins() {
        return this.ctx.client.getParticipants(this.event.chatId!, {filter: new Api.ChannelParticipantsAdmins()});
    }
}