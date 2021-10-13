import {CommandRepresentation} from "../../CommandRepresentation";
import {NotifyGroup, NotifyGroupArgs} from "./NotifyGroup";
import yargsParser, {Arguments} from "yargs-parser";
import {NewMessageEvent} from "telegram/events";
import {ICommandHandler} from "../../ICommandHandler";
import * as Joi from 'joi';

export class NotifyGroupRepresentation extends CommandRepresentation<Partial<NotifyGroupArgs> & Arguments, NotifyGroupArgs> {
    factory(event: NewMessageEvent, validatedArguments: NotifyGroupArgs): Promise<ICommandHandler> | ICommandHandler {
        return new NotifyGroup(this.ctx, event, validatedArguments);
    }

    getArgumentsOptions(): yargsParser.Options {
        return {
            string: ['groupName'],
            number: ['countPerMessage', 'delayBetweenMessages'],
            alias: {
                delayBetweenMessages: 'd',
                groupName: 'g',
                countPerMessage: 'c',
            }
        }
    }

    validateArguments(parsedArgs: Partial<NotifyGroupArgs> & yargsParser.Arguments): Promise<NotifyGroupArgs> | NotifyGroupArgs {
        return this.ctx.common.validateJoi(Joi.object({
            groupName: Joi.string().required(),
            countPerMessage: Joi.number().min(2),
            delayBetweenMessages: Joi.number().min(50).default(500)
        }), parsedArgs);
    }

}