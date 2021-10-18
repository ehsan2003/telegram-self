import {BaseCommandHandler} from "../../../BaseCommandHandler";
import yargsParser from "yargs-parser";
import {MessageLike} from "../../../MessageLike";
import {validateJoi} from "../../../../utils";
import * as Joi from "joi";
import {SelfError} from "../../../../SelfError";

export type PreparedTextSenderArgs = {
    textId: string;
} | { textCategory: string; };

export class PreparedTextSender extends BaseCommandHandler<any, PreparedTextSenderArgs> {
    protected async execute(message: MessageLike, validatedArgs: PreparedTextSenderArgs): Promise<void> {
        if (!message.messageId) {
            throw new SelfError('message id must exists');
        }
        let text = await this.preparedText(validatedArgs);
        await this.ctx.client.editMessage(message.chatId, {text: text.text, message: message.messageId});
    }

    private async preparedText(validatedArgs: PreparedTextSenderArgs) {
        if ('textId' in validatedArgs) {
            const temp = await this.ctx.prisma.preparedText.findUnique({where: {identifier: validatedArgs.textId}});
            if (!temp) {
                throw new SelfError('text not found');
            }
            return temp;

        } else {
            return await this.ctx.common.getRandomTextByCategory(validatedArgs.textCategory);
        }
    }

    protected getArgsParserOptions(): yargsParser.Options {
        return {
            string: ['textCategory', 'textId'],
            alias: {textCategory: 'c', textId: 'i'}
        };
    }

    getHelp(): string {
        return "";
    }

    getShortHelp(): string {
        return "";
    }

    protected validateParsedArgs(parsedArgs: any): any {
        return validateJoi(Joi.object({
            textId: Joi.string(),
            textCategory: Joi.string()
        }).xor('textId', 'textCategory'), parsedArgs);
    }

    // async handle(): Promise<void> {

    // }

}