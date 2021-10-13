import {ICommandHandler} from "../../ICommandHandler";
import {PreparedText} from '@prisma/client';
import {Context} from "../../../Context";
import {NewMessageEvent} from "telegram/events";
import {SelfError} from "../../../SelfError";

export type PreparedTextSenderArgs = {
    textId: string;
} | { textCategory: string; };

export class PreparedTextSender implements ICommandHandler {
    constructor(protected ctx: Context, protected event: NewMessageEvent, protected args: PreparedTextSenderArgs) {
    }

    async handle(): Promise<void> {
        let text: PreparedText;
        if ('textId' in this.args) {
            const temp = await this.ctx.prisma.preparedText.findUnique({where: {identifier: this.args.textId}});
            if (!temp) {
                throw new SelfError('text not found');
            }
            text = temp;

        } else {
            text = await this.ctx.common.getRandomTextByCategory(this.args.textCategory);
        }
        await this.event.message.edit({text: text.text});
    }

}