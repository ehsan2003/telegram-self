import {ICommandFactory} from "./CommandFactory";
import {ICommandHandler} from "./ICommandHandler";
import {NewMessageEvent} from "telegram/events";
import {Arguments, detailed, Options} from "yargs-parser";
import {SelfError} from "../SelfError";
import {Context} from "../Context";

export abstract class CommandRepresentation<ParsedArgs, ValidatedArguments> implements ICommandFactory {
    constructor(protected ctx: Context) {
    }

    async createHandler(event: NewMessageEvent, rawArguments: string[]): Promise<ICommandHandler> {
        const argumentsOptions = this.getArgumentsOptions();
        const args = detailed(rawArguments, argumentsOptions);
        if (args.error) {
            throw new SelfError(args.error.message);
        }
        const validatedArguments = await this.validateArguments(args.argv as ParsedArgs & Arguments);
        return this.factory(event, validatedArguments);
    }

    abstract factory(event: NewMessageEvent, validatedArguments: ValidatedArguments): Promise<ICommandHandler> | ICommandHandler;

    abstract getArgumentsOptions(): Options;

    abstract validateArguments(parsedArgs: ParsedArgs): Promise<ValidatedArguments> | ValidatedArguments;

}