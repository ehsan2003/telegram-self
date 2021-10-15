import {IProcess} from "./IProcess";
import {filter, Subject, takeUntil} from "rxjs";
import {Context} from "../Context";
import {NewMessageEvent} from "telegram/events";
import {Api} from "telegram";
import {getPeerId} from "../utils";

type ForwardableUpdates =
    Api.UpdateNewMessage
    | Api.UpdateNewEncryptedMessage
    | Api.UpdateServiceNotification
    | Api.UpdateNewChannelMessage
    | Api.UpdateEditChannelMessage
    | Api.UpdateEditMessage
    | Api.UpdateNewScheduledMessage;

export type WatcherProcessArgs = { chatId: number, forwardTo: number };

export class WatcherProcess implements IProcess {
    private clearSubject = new Subject();
    private messagesSubject = new Subject<NewMessageEvent>();
    private eventCallback = (event: NewMessageEvent) => this.messagesSubject.next(event);

    clear(): any {
        this.clearSubject.next(null);
        this.ctx.client.removeEventHandler(this.eventCallback, undefined as any);
    }

    async start(): Promise<any> {
        console.log(this.args);
        this.ctx.eventsSubject.pipe(
            takeUntil(this.clearSubject),
            filter((test): test is ForwardableUpdates => 'message' in test && typeof test.message !== 'string' && test.message.className === 'Message' && getPeerId(test.message.peerId) === this.args.chatId)
        ).subscribe(async (update) => {
            if ('message' in update && typeof update.message !== 'string' && update.message.className === 'Message' && getPeerId(update.message.peerId) === this.args.chatId) {
                await this.ctx.client.forwardMessages(this.args.forwardTo, {
                    messages: [update.message.id!],
                    fromPeer: getPeerId(update.message.peerId)
                })
            }

        })

    }

    constructor(private ctx: Context, private args: WatcherProcessArgs) {
    }

}