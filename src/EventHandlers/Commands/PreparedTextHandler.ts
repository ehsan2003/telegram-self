import {CommandHandlerBase} from "./CommandHandler.base";
import yargs from "yargs";
import {NewMessageEvent} from "telegram/events";
import _ from 'lodash';
import {SelfError} from "../../SelfError";

export type Args =
    | { textId: string }
    | { category: string }

export class PreparedTextHandler extends CommandHandlerBase<Args> {
    async execute(event: NewMessageEvent, args: Args): Promise<void> {
        this.validateOrThrow(args);
        await this.sendText(args, event);
    }

    private async sendText(args: { textId: string } | { category: string }, event: NewMessageEvent) {
        let textToSend = await this.getTextToSend(args);
        if (textToSend) {
            await event.message.edit({text: textToSend.text, parseMode: 'html'});
        } else {
            throw new SelfError('text not found');
        }
    }

    private validateOrThrow(args: Args) {
        if (('textId' in args && !!args.textId) === ('category' in args && !!args.category)) {
            throw new SelfError('you should send one of ( and only on of ) category or textId');
        }
    }

    private async getTextToSend(args: Args) {
        if ('textId' in args) {
            return await this.ctx.prisma.preparedText.findUnique({where: {identifier: args.textId}});
        } else {
            const preparedTexts = await this.ctx.prisma.preparedText.findMany({where: {tags: {some: {name: args.category}}}});
            return _.sample(preparedTexts)
        }
    }

    getArgumentParser(): yargs.Argv<Args> {
        return yargs
            .option('textId', {string: true, alias: 't'})
            .option('category', {string: true, alias: 'c'}) as any
    }

    getName(): string {
        return "text";
    }
}
