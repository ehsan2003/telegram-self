import {NewMessageEvent} from "telegram/events";
import {ICommandHandler} from "../../ICommandHandler";
import yargsParser from "yargs-parser";
import {ProcessStopper, ProcessStopperArgs} from "./ProcessStopper";
import {CommandRepresentation} from "../../CommandRepresentation";
import {validateJoi} from "../../../utils";
import * as Joi from 'joi';

export class ProcessStopperFactory extends CommandRepresentation<ProcessStopperArgs, ProcessStopperArgs> {
    factory(event: NewMessageEvent, validatedArguments: ProcessStopperArgs): Promise<ICommandHandler> | ICommandHandler {
        return new ProcessStopper(this.ctx, event, validatedArguments);
    }

    getArgumentsOptions(): yargsParser.Options {
        return {string: ['name', 'id']}
    }

    validateArguments(parsedArgs: ProcessStopperArgs): Promise<ProcessStopperArgs> | ProcessStopperArgs {
        return validateJoi(Joi.object({id: Joi.number().integer(), name: Joi.string()}).xor('id', 'name'), parsedArgs)
    }
}