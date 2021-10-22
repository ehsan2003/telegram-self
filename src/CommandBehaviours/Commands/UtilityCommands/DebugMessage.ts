import {SelfError} from "../../../SelfError";
import {stringify} from 'yaml';
import {getCircularReplacer, prepareLongMessage} from "../../../utils";
import {BaseCommandHandler} from "../../BaseCommandHandler";
import yargsParser, {Arguments} from "yargs-parser";
import {MessageLike} from "../../MessageLike";

export type DebugMessageArgs = {
    chat: boolean;
}

export class DebugMessage extends BaseCommandHandler<DebugMessageArgs> {


    private stringify(reply: any) {
        return stringify(JSON.parse(JSON.stringify(reply, getCircularReplacer())))
    }

    protected async execute(message: MessageLike, parsedArgs: DebugMessageArgs): Promise<void> {
        const reply = await message.getReplyTo();
        if (!reply) {
            throw new SelfError('no reply for debug message');
        }
        await this.ctx.client.sendMessage(parsedArgs.chat ? message.getChatId()! : 'me', prepareLongMessage(this.stringify(reply)));
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

    protected validateParsedArgs(parsedArgs: Arguments): DebugMessageArgs {
        return {chat: parsedArgs.chat};
    }

}