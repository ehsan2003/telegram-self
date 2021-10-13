import {ICommandFactory} from "../../CommandFactory";
import {NewMessageEvent} from "telegram/events";
import {ICommandHandler} from "../../ICommandHandler";
import {SpamStarter, SpamStarterArgs} from "./SpamStarter";
import {Context} from "../../../Context";
import yargsParser from "yargs-parser";
import {SelfError} from "../../../SelfError";

export class SpamStarterFactory implements ICommandFactory {
    constructor(private ctx: Context) {
    }

    createHandler(event: NewMessageEvent, rawArguments: string[]): Promise<ICommandHandler> | ICommandHandler {
        return new SpamStarter(this.ctx, event, this.parseArguments(rawArguments));
    }

    private parseArguments(raw: string[]): SpamStarterArgs {
        const parsed = yargsParser.detailed(raw, {
            number: ['interval'],
            string: ['chatId', 'textCategory', 'name'],
            alias: {interval: 'i', textCategory: 't', chatId: 'c'},
            default: {
                interval: 1000,
            }
        });
        if (parsed.error) {
            throw new SelfError(parsed.error.message);
        }
        return parsed.argv as SpamStarterArgs;
    }

}