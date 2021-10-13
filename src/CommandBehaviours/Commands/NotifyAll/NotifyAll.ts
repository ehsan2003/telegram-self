import {ICommandHandler} from "../../ICommandHandler";
import {Context} from "../../../Context";
import {NewMessageEvent} from "telegram/events";
import {NotifyBase, NotifyBaseArgs} from "../Notify.base";

export type NotifyAllArguments = NotifyBaseArgs

export class NotifyAll extends NotifyBase implements ICommandHandler {

    constructor(protected ctx: Context, protected event: NewMessageEvent, protected args: NotifyAllArguments) {
        super(ctx, event, args);
    }

    async handle(): Promise<void> {
        const participants = await this.ctx.client.getParticipants(this.event.chatId!, {});
        await this.notifyUsers(participants);
    }

}