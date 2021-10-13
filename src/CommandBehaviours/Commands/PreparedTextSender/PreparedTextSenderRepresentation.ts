import {CommandRepresentation} from "../../CommandRepresentation";
import {PreparedTextSender, PreparedTextSenderArgs} from "./PreparedTextSender";
import yargsParser, {Arguments} from "yargs-parser";
import {NewMessageEvent} from "telegram/events";
import {ICommandHandler} from "../../ICommandHandler";
import * as Joi from 'joi';
import {SelfError} from "../../../SelfError";

export class PreparedTextSenderRepresentation extends CommandRepresentation<Partial<{ textId: string; textCategory: string; }> & Arguments, PreparedTextSenderArgs> {
    factory(event: NewMessageEvent, validatedArguments: PreparedTextSenderArgs): Promise<ICommandHandler> | ICommandHandler {
        return new PreparedTextSender(this.ctx, event, validatedArguments);
    }

    getArgumentsOptions(): yargsParser.Options {
        return {
            string: ['textCategory', 'textId'],
            alias: {textCategory: 'c', textId: 'i'}
        }
    }

    validateArguments(parsedArgs: Partial<{ textId: string; textCategory: string }> & Arguments): Promise<PreparedTextSenderArgs> | PreparedTextSenderArgs {
        const validator = Joi.object({
            textId: Joi.string(),
            textCategory: Joi.string()
        }).xor('textId', 'textCategory');

        const {error, value: validated} = validator.validate(parsedArgs, {stripUnknown: true});
        if (error) {
            throw new SelfError(error.message)
        }
        return validated;
    }

}