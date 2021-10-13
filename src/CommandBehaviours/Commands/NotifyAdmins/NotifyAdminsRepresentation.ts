import {CommandRepresentation} from "../../CommandRepresentation";
import yargsParser, {Arguments} from "yargs-parser";
import {NewMessageEvent} from "telegram/events";
import {ICommandHandler} from "../../ICommandHandler";
import {NotifyAdmins, NotifyAdminsArgs} from "./NotifyAdmins";
import * as Joi from 'joi';

export class NotifyAdminsRepresentation extends CommandRepresentation<NotifyAdminsArgs & Arguments, NotifyAdminsArgs> {
    factory(event: NewMessageEvent, validatedArguments: NotifyAdminsArgs): Promise<ICommandHandler> | ICommandHandler {
        return new NotifyAdmins(this.ctx, event, validatedArguments);
    }

    getArgumentsOptions(): yargsParser.Options {
        return {
            string: ['countPerMessage', 'delayBetweenMessages'],
            alias: {countPerMessage: 'c', delayBetweenMessages: 'd'}
        }
    }

    validateArguments(parsedArgs: NotifyAdminsArgs & yargsParser.Arguments): Promise<NotifyAdminsArgs> | NotifyAdminsArgs {
        return this.ctx.common.validateJoi(Joi.object({
            countPerMessage: Joi.number().min(2).default(5),
            delayBetweenMessages: Joi.number().positive().default(500)
        }), parsedArgs);
    }


}