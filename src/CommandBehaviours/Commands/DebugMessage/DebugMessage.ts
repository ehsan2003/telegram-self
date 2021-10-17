import {SelfError} from "../../../SelfError";
import {stringify} from 'yaml';
import {getCircularReplacer, prepareLongMessage} from "../../../utils";
import {BaseCommandHandler} from "../../BaseCommandHandler";
import yargsParser from "yargs-parser";
import {MessageLike} from "../../MessageLike";

export type DebugMessageArgs = {
    chat: boolean;
}

export class DebugMessage extends BaseCommandHandler<DebugMessageArgs, DebugMessageArgs> {


    private stringify(reply: any) {
        return stringify(JSON.parse(JSON.stringify(reply, getCircularReplacer())))
    }

    protected async execute(message: MessageLike, parsedArgs: DebugMessageArgs): Promise<void> {
        const reply = await this.ctx.client.getMessages(message.chatId, {ids: message.replyTo}).then(e => e[0]);
        if (!reply) {
            throw new SelfError('no reply for debug message');
        }
        await this.ctx.client.sendMessage(parsedArgs.chat ? message.chatId! : 'me', prepareLongMessage(this.stringify(reply)));
    }

    protected getArgsParserOptions(): yargsParser.Options {
        return {boolean: ['chat'], alias: {chat: 'c'}};
    }

    getHelp(): string {
        return "outputs debug string to the user about reply message";
    }

    getShortHelp(): string {
        return "";
    }

    protected validateParsedArgs(parsedArgs: DebugMessageArgs): DebugMessageArgs {
        return parsedArgs;
    }

}