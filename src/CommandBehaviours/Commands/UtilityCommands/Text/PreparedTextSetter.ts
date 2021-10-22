import {BaseCommandHandler} from "../../../BaseCommandHandler";
import {MessageLike} from "../../../MessageLike";
import yargsParser from "yargs-parser";
import {SelfError} from "../../../../SelfError";

type PreparedTextSetterArgs = { name: string };

export class PreparedTextSetter extends BaseCommandHandler<PreparedTextSetterArgs> {
    protected async execute(message: MessageLike, validatedArgs: PreparedTextSetterArgs): Promise<void> {
        // if (!message.replyTo) {
        //     throw new SelfError('message must have a reply');
        // }
        // const replyMessage = (await this.ctx.client.getMessages(message.chatId, {ids: message.replyTo}))[0];
        const replyMessage = await message.getReplyTo();
        if (!replyMessage) {
            throw new SelfError('message must have a reply');
        }
        await this.ctx.prisma.preparedText.upsert({
            where: {
                identifier: validatedArgs.name,
            },
            create: {
                text: replyMessage.message,
                entitiesJson: JSON.stringify(replyMessage.entities),
                identifier: validatedArgs.name
            }, update: {
                text: replyMessage.message,
                entitiesJson: JSON.stringify(replyMessage.entities),
            }
        })

    }

    protected getArgsParserOptions(): yargsParser.Options {
        return {};
    }

    getHelp(): string {
        return "";
    }

    getShortHelp(): string {
        return "";
    }

    protected validateParsedArgs(parsedArgs: yargsParser.Arguments): Promise<PreparedTextSetterArgs> | PreparedTextSetterArgs {
        const name = parsedArgs._[0];
        if (!name) {
            throw new SelfError('argument name is required');
        }
        return {name};
    }

}