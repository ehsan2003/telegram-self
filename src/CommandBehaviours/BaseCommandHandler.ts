import {ICommandHandler} from "./ICommandHandler";
import {MessageLike} from "./MessageLike";
import {Context} from "../Context";
import {Arguments, detailed, Options} from "yargs-parser";
import {SelfError} from "../SelfError";

export abstract class BaseCommandHandler<ParsedArgs = any, ValidatedArguments = any> implements ICommandHandler {
    constructor(protected ctx: Context) {
    }

    async handle(messageLike: MessageLike, args: string[]): Promise<void> {
        const parsedArgs = this.parseArgs(args).argv;
        console.log(parsedArgs);
        const modifiedMessageLike = this.modifyMessageLike(messageLike, parsedArgs);
        console.log(modifiedMessageLike, messageLike);
        const validatedArgs = this.validateParsedArgs(parsedArgs as ParsedArgs & Arguments);
        await this.execute(modifiedMessageLike, validatedArgs);
    }

    private modifyMessageLike(originalMessageLike: MessageLike, parsedArgs: any) {
        const result = {...originalMessageLike};
        if (parsedArgs.chatId) {
            console.log(parsedArgs.chatId)
            if (isNaN(+parsedArgs.chatId)) {
                throw new SelfError('invalid chatId argument');
            }
            result.chatId = +parsedArgs.chatId
            console.log(result.chatId)
        }
        if (parsedArgs.replyId) {
            if (isNaN(+parsedArgs.replyId)) {
                throw new SelfError('invalid replyId argument');
            }
            result.replyTo = +parsedArgs.replyId;
        }
        return result;
    }

    private parseArgs(args: string[]) {
        const parserOptions = this.getArgsParserOptions();
        const parsedArgs = detailed(args, parserOptions);
        if (parsedArgs.error) {
            throw new SelfError(parsedArgs.error.message);
        }
        return parsedArgs;
    }

    abstract getShortHelp(): string;

    abstract getHelp(): string;

    protected abstract execute(message: MessageLike, validatedArgs: ValidatedArguments): Promise<void>;

    protected abstract getArgsParserOptions(): Options;

    protected abstract validateParsedArgs(parsedArgs: ParsedArgs & Arguments): ValidatedArguments;
}