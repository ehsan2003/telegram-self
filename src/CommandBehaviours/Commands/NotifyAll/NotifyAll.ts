import {ICommandHandler} from "../../ICommandHandler";
import {Context} from "../../../Context";
import {NewMessageEvent} from "telegram/events";
import {chunk} from "lodash";
import {Api, utils} from "telegram";
import {sleep} from "telegram/Helpers";

export type NotifyAllArguments = {
    countPerMessage: number;
    delayBetweenMessages: number;
}

export class NotifyAll implements ICommandHandler {
    constructor(private ctx: Context, private event: NewMessageEvent, private args: NotifyAllArguments) {
    }

    async handle(): Promise<void> {
        const participants = await this.ctx.client.getParticipants(this.event.chatId!, {});
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