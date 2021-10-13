import {ICommandHandler} from "../../ICommandHandler";
import {Context} from "../../../Context";
import {NewMessageEvent} from "telegram/events";
import {utils} from "telegram";

export class DeleteMe implements ICommandHandler {
    async handle(): Promise<void> {
        const messages = await this.ctx.client.getMessages(this.chatId, {
            limit: this.countToDelete,
            fromUser: 'me',
        });
        await this.ctx.client.deleteMessages(this.chatId, messages.map(m => m.id), {});
        const chat = await this.ctx.client.getEntity(this.chatId);
        await this.ctx.common.tellUser(`deleted ${messages.length} messages from "${utils.getDisplayName(chat)}"`)
    }

    private readonly chatId: number;

    constructor(private ctx: Context, private event: NewMessageEvent, private countToDelete: number) {
        this.chatId = event.chatId!;
    }

}