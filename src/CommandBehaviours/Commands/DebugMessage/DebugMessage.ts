import {ICommandHandler} from "../../ICommandHandler";
import {Context} from "../../../Context";
import {NewMessageEvent} from "telegram/events";
import {Arguments} from "yargs-parser";
import {SelfError} from "../../../SelfError";
import {stringify} from 'yaml';
import {getCircularReplacer, prepareLongMessage} from "../../../utils";

export type DebugMessageArgs = {
    chat: boolean;
} & Arguments

export class DebugMessage implements ICommandHandler {
    constructor(private ctx: Context, private event: NewMessageEvent, private args: DebugMessageArgs) {
    }

    async handle(): Promise<void> {
        const reply = await this.event.message.getReplyMessage();
        if (!reply) {
            throw new SelfError('no reply for debug message');
        }
        await this.ctx.client.sendMessage(this.args.chat ? this.event.chatId! : 'me', prepareLongMessage(this.stringify(reply)));
    }

    private stringify(reply: any) {
        return stringify(JSON.parse(JSON.stringify(reply, getCircularReplacer())))
    }

}