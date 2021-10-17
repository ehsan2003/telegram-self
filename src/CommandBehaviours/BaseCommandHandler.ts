import {ICommandHandler} from "./ICommandHandler";
import {MessageLike} from "./MessageLike";
import {Context} from "../Context";
import {Arguments, detailed, Options} from "yargs-parser";
import {SelfError} from "../SelfError";

export abstract class BaseCommandHandler<ParsedArgs = any, ValidatedArguments = any> implements ICommandHandler {
    constructor(protected ctx: Context) {}

    async handle(messageLike: MessageLike, args: string[]): Promise<void> {
        const parsedArgs = this.parseArgs(args);

        const modifiedMessageLike = this.modifyMessageLike(messageLike, parsedArgs)
        const validatedArgs = this.validateParsedArgs(parsedArgs.argv as ParsedArgs & Arguments);
        await this.execute(modifiedMessageLike, validatedArgs);
    }

    private modifyMessageLike(originalMessageLike: MessageLike, parsedArgs: any) {
        const result = {...originalMessageLike};
        if (parsedArgs.chatId) {
            if (isNaN(+parsedArgs.chatId)) {
                throw new SelfError('invalid chatId argument');
            }
            result.chatId = +parsedArgs.chatId
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
        const parsedArgs = detailed(args, {
            ...parserOptions,
            boolean: [...parserOptions.boolean || [], 'help'],
            number: [...parserOptions.number || [], 'chatId', 'replyId'],
            alias: {...parserOptions.alias || {}, help: 'h', chatId: 'cid', replyId: 'rid'}
        });

        if (parsedArgs.argv.help) {
            throw new SelfError(this.getHelp());
        }
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