import {Context} from "../../Context";
import {NewMessageEvent} from "telegram/events";
import {Api, utils} from "telegram";
import {chunk} from "lodash";
import {sleep} from "telegram/Helpers";

export type NotifyBaseArgs = {
    countPerMessage: number;
    delayBetweenMessages: number;
}

export class NotifyBase {
    constructor(protected ctx: Context, protected event: NewMessageEvent, protected args: NotifyBaseArgs) {}

    protected async notifyUsers(participants: Api.User[]) {
        const chunks = chunk(participants, this.args.countPerMessage)
        for (const chunk of chunks) {
            await this.ctx.client.sendMessage(this.event.chatId!, {
                message: this.getMessageForChunk(chunk),
                parseMode: 'html'
            })
            await sleep(this.args.delayBetweenMessages);
        }
    }

    private getMessageForChunk(chunk: Api.User[]): string {
        return chunk.map(user => `<a href="tg://user?id=${user.id}">${utils.getDisplayName(user)}</a>`).join(' ')
    }
}