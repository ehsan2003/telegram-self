import {WatcherProcess} from "../../../Processes/Processes/WatcherProcess";
import {BaseCommandHandler} from "../../BaseCommandHandler";
import {MessageLike} from "../../MessageLike";
import yargsParser from "yargs-parser";
import {validateJoi} from "../../../utils";
import * as Joi from "joi";

export type WatcherProcessStarterArgs = {
    inputChat: string
    outputChat: string;
}

export class WatcherProcessStarter extends BaseCommandHandler<WatcherProcessStarter, WatcherProcessStarter> {
    protected async execute(message: MessageLike, validatedArgs: any): Promise<void> {
        const inputChat = await this.ctx.client.getPeerId(isNaN(+validatedArgs.inputChat) ? validatedArgs.inputChat : +validatedArgs.inputChat, false)

        const outputChat = await this.ctx.client.getPeerId(isNaN(+validatedArgs.outputChat) ? validatedArgs.outputChat : +validatedArgs.outputChat, false)

        this.ctx.processManager.run(new WatcherProcess(this.ctx, {chatId: inputChat, forwardTo: outputChat}))
    }

    protected getArgsParserOptions(): yargsParser.Options {
        return {
            string: ['inputChat', 'outputChat',],
            alias: {
                inputChat: 'i',
                outputChat: 'o',
            }
        };
    }

    getHelp(): string {
        return "";
    }

    getShortHelp(): string {
        return "";
    }

    protected validateParsedArgs(parsedArgs: WatcherProcessStarter): WatcherProcessStarter {
        return validateJoi(Joi.object({
            inputChat: Joi.string().required(),
            outputChat: Joi.string().required(),
        }), parsedArgs);
    }


}