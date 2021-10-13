import {ICommandFactory} from "../../CommandFactory";
import {Context} from "../../../Context";
import {NewMessageEvent} from "telegram/events";
import {ICommandHandler} from "../../ICommandHandler";
import yargsParser from "yargs-parser";
import {SelfError} from "../../../SelfError";
import {ProcessStopper, ProcessStopperArgs} from "./ProcessStopper";

export class ProcessStopperFactory implements ICommandFactory {
    createHandler(event: NewMessageEvent, rawArguments: string[]): Promise<ICommandHandler> | ICommandHandler {
        const args = this.parseArguments(rawArguments);
        return new ProcessStopper(this.ctx, event, args);
    }

    private parseArguments(raw: string[]): ProcessStopperArgs {
        const parsed = yargsParser.detailed(raw, {string: ['name', 'id']});
        if (parsed.error) {
            throw new SelfError(parsed.error.message);
        }
        return parsed.argv as ProcessStopperArgs;
    }

    constructor(private ctx: Context) {
    }

}