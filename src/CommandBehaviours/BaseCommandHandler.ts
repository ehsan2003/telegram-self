import {ICommandHandler} from "./ICommandHandler";
import {MessageLike} from "./MessageLike";
import {Context} from "../Context";
import {Arguments, detailed, Options} from "yargs-parser";
import {SelfError} from "../SelfError";

export abstract class BaseCommandHandler<ValidatedArguments> implements ICommandHandler {
    constructor(protected ctx: Context) {
    }

    async handle(messageLike: MessageLike, args: string[]): Promise<void> {
        const parsedArgs = this.parseArgs(args).argv;
        const validatedArgs = await this.validateParsedArgs(parsedArgs);
        await this.execute(messageLike, validatedArgs);
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

    protected abstract validateParsedArgs(parsedArgs: Arguments): ValidatedArguments | Promise<ValidatedArguments>;
}