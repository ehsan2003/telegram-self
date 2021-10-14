import {NewMessageEvent} from "telegram/events";
import {ICommandHandler} from "../../ICommandHandler";
import {DebugMessage, DebugMessageArgs} from "./DebugMessage";
import yargsParser from "yargs-parser";
import {CommandRepresentation} from "../../CommandRepresentation";

export class DebugMessageFactory extends CommandRepresentation<DebugMessageArgs, DebugMessageArgs> {

    factory(event: NewMessageEvent, validatedArguments: DebugMessageArgs): Promise<ICommandHandler> | ICommandHandler {
        return new DebugMessage(this.ctx, event, validatedArguments);
    }

    getArgumentsOptions(): yargsParser.Options {
        return {boolean: ['chat'], alias: {chat: 'c'}, default: {chat: false}}
    }

    validateArguments(parsedArgs: DebugMessageArgs): Promise<DebugMessageArgs> | DebugMessageArgs {
        return parsedArgs;
    }
}