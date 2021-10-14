import {NewMessageEvent} from "telegram/events";
import {ICommandHandler} from "../../ICommandHandler";
import {SpamStarter, SpamStarterArgs} from "./SpamStarter";
import yargsParser from "yargs-parser";
import {CommandRepresentation} from "../../CommandRepresentation";

export class SpamStarterFactory extends CommandRepresentation<SpamStarterArgs, SpamStarterArgs> {
    factory(event: NewMessageEvent, validatedArguments: SpamStarterArgs): Promise<ICommandHandler> | ICommandHandler {
        return new SpamStarter(this.ctx, event, validatedArguments);
    }

    getArgumentsOptions(): yargsParser.Options {
        return {
            number: ['interval'],
            string: ['chatId', 'textCategory', 'name'],
            alias: {interval: 'i', textCategory: 't', chatId: 'c'},
            default: {
                interval: 1000,
            }
        }
    }

    validateArguments(parsedArgs: SpamStarterArgs): Promise<SpamStarterArgs> | SpamStarterArgs {
        return parsedArgs;
    }

}