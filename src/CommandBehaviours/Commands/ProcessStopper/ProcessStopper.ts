import {BaseCommandHandler} from "../../BaseCommandHandler";
import {MessageLike} from "../../MessageLike";
import yargsParser from "yargs-parser";
import {validateJoi} from "../../../utils";
import * as Joi from "joi";

export type ProcessStopperArgs = { name: string; } | { id: string; };

export class ProcessStopper extends BaseCommandHandler {
    // async handle(): Promise<void> {
    //     if ('name' in this.args) {
    //         this.ctx.processManager.stopByName(this.args.name);
    //     } else {
    //         this.ctx.processManager.stop(+this.args.id)
    //     }
    // }


    protected async execute(message: MessageLike, validatedArgs: any): Promise<void> {
        if ('name' in validatedArgs) {
            this.ctx.processManager.stopByName(validatedArgs.name);
        } else {
            this.ctx.processManager.stop(+validatedArgs.id)
        }
    }

    protected getArgsParserOptions(): yargsParser.Options {
        return {string: ['name', 'id']};
    }

    getHelp(): string {
        return "";
    }

    getShortHelp(): string {
        return "";
    }

    protected validateParsedArgs(parsedArgs: ProcessStopperArgs): ProcessStopperArgs {
        return validateJoi(Joi.object({id: Joi.number().integer(), name: Joi.string()}).xor('id', 'name'), parsedArgs)
    }
}