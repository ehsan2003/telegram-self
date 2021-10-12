import {ICommandFactory} from "../../CommandFactory";
import {Context} from "../../../Context";
import {NewMessageEvent} from "telegram/events";
import {ICommandHandler} from "../../ICommandHandler";
import {DebugMessage, DebugMessageArgs} from "./DebugMessage";
import yargsParser from "yargs-parser";
import {SelfError} from "../../../SelfError";

export class DebugMessageFactory implements ICommandFactory {
    constructor(private ctx: Context) {
    }

    createHandler(event: NewMessageEvent, rawArguments: string[]): Promise<ICommandHandler> | ICommandHandler {
        return new DebugMessage(this.ctx, event, this.parseArguments(rawArguments));
    }

    parseArguments(raw: string[]): DebugMessageArgs {
        const parsed = yargsParser.detailed(raw, {boolean: ['chat'], alias: {chat: 'c'}, default: {chat: false}});
        if (parsed.error) {
            throw new SelfError(parsed.error.message);
        }
        return parsed.argv as DebugMessageArgs;
    }
}