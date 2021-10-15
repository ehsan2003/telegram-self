import * as Joi from 'joi';
import {CommandRepresentation} from "../../CommandRepresentation";
import {WatcherProcessArgs} from "../../../Processes/WatcherProcess";
import {WatcherProcessStarter, WatcherProcessStarterArgs} from "./WatcherProcessStarter";
import {NewMessageEvent} from "telegram/events";
import {ICommandHandler} from "../../ICommandHandler";
import yargsParser, {Arguments} from "yargs-parser";
import {validateJoi} from "../../../utils";

export class WatcherProcessStarterRepresentation extends CommandRepresentation<WatcherProcessArgs, WatcherProcessStarterArgs> {
    factory(event: NewMessageEvent, validatedArguments: WatcherProcessStarterArgs): Promise<ICommandHandler> | ICommandHandler {
        return new WatcherProcessStarter(this.ctx, event, validatedArguments);
    }

    getArgumentsOptions(): yargsParser.Options {
        return {
            string: ['inputChat', 'outputChat',],
            alias: {
                inputChat: 'i',
                outputChat: 'o',
            }
        }
    }

    validateArguments(parsedArgs: WatcherProcessArgs & Arguments): Promise<WatcherProcessStarterArgs> | WatcherProcessStarterArgs {
        return validateJoi(Joi.object({
            inputChat: Joi.string().required(),
            outputChat: Joi.string().required(),
        }), parsedArgs);
    }

}