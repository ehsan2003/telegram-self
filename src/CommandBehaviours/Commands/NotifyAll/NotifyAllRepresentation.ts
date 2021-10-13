import {CommandRepresentation} from "../../CommandRepresentation";
import {NotifyAll, NotifyAllArguments} from "./NotifyAll";
import yargsParser, {DetailedArguments, Options} from "yargs-parser";
import {ICommandHandler} from "../../ICommandHandler";
import {NewMessageEvent} from "telegram/events";
import * as Joi from 'joi';
import {SelfError} from "../../../SelfError";

export class NotifyAllRepresentation extends CommandRepresentation<Partial<NotifyAllArguments> & DetailedArguments, NotifyAllArguments> {
    factory(event: NewMessageEvent, validatedArguments: NotifyAllArguments): Promise<ICommandHandler> | ICommandHandler {
        return new NotifyAll(this.ctx, event, validatedArguments);
    }

    getArgumentsOptions(): Options {
        return {
            string: ['countPerMessage', 'delayBetweenMessages'],
            alias: {countPerMessage: 'c', delayBetweenMessages: 'd'}
            , configuration: {"strip-aliased": false}
        }
    }

    validateArguments(parsedArgs: Partial<NotifyAllArguments> & yargsParser.DetailedArguments): Promise<NotifyAllArguments> | NotifyAllArguments {
        const validator = Joi.object({
            countPerMessage: Joi.number().min(2).default(5),
            delayBetweenMessages: Joi.number().positive().default(500)
        })
        const {error, value: validatedArguments} = validator.validate(parsedArgs, {stripUnknown: true})
        if (error) {
            throw new SelfError(error.message);
        }
        return validatedArguments;
    }

}