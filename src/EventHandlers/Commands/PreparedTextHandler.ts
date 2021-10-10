import {CommandHandlerBase} from "./CommandHandler.base";
import yargs from "yargs";
import _ from 'lodash';
import {SelfError} from "../../SelfError";
import {CommandHandlerFactory} from "./CommandHandlerFactory.base";
import {NewMessageEvent} from "telegram/events";

export type Args =
    | { textId: string }
    | { category: string }

export class PreparedTextHandler extends CommandHandlerBase<Args> {
    async execute(): Promise<void> {
        await this.sendText();
    }

    private async sendText() {
        let textToSend = await this.getTextToSend();
        if (textToSend) {
            await this.event.message.edit({text: textToSend.text, parseMode: 'html'});
        } else {
            throw new SelfError('text not found');
        }
    }


    private async getTextToSend() {
        if ('textId' in this.args) {
            return await this.ctx.prisma.preparedText.findUnique({where: {identifier: this.args.textId as string}});
        } else {
            const preparedTexts = await this.ctx.prisma.preparedText.findMany({where: {tags: {some: {name: this.args.category as string}}}});
            return _.sample(preparedTexts)
        }
    }


}

export class PreparedTextFactory extends CommandHandlerFactory {
    createInstance(event: NewMessageEvent, args: yargs.Arguments<Args>): Promise<CommandHandlerBase<any>> {
        return Promise.resolve(new PreparedTextHandler(this.ctx, event, args));
    }

    getArgumentParser(): yargs.Argv<Args> {
        return yargs
            .option('textId', {string: true, alias: 't'})
            .option('category', {string: true, alias: 'c'}).check((args) => {
                if (('textId' in args && !!args.textId) === ('category' in args && !!args.category)) {
                    return 'you should send one of ( and only on of ) category or textId';
                }
            }) as any
    }

    getName(): string {
        return "text";
    }
}
