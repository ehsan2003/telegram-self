import {EventHandlerFactory} from "../EventHandlerFactory.base";
import {SelfError} from "../../SelfError";
import yargs, {Arguments} from "yargs";
import {NewMessageEvent} from "telegram/events";
import {CommandHandlerBase} from "./CommandHandler.base";

export abstract class CommandHandlerFactory extends EventHandlerFactory {
    async canHandle(event: any): Promise<boolean> {

        return event?.message?.message && this.getPattern().test(event.message.message!);
    }


    async createHandler(event: NewMessageEvent): Promise<CommandHandlerBase<any>> {
        const rawArguments = this.getRawArguments(event.message.message!)
        this.ctx.logger.info(`event "${this.getName()}" happened with arguments \`${rawArguments}\``);
        const args = await this.parseArguments(rawArguments);
        return this.createInstance(event, args)
    }

    abstract createInstance(event: NewMessageEvent, args: Arguments): Promise<CommandHandlerBase<any>>

    private async parseArguments(rawArguments: string) {
        const parser = this.getArgumentParser().fail(false);
        try {
            return parser.parse(rawArguments)
        } catch {
            throw new SelfError(await parser.wrap(50).getHelp());
        }
    }

    private getRawArguments(messageText: string) {
        return messageText.match(this.getPattern())![1].trim();
    }

    getPattern() {
        return new RegExp(`!${this.getName()}(.*)`);
    }

    protected abstract getName(): string;

    protected abstract getArgumentParser(): yargs.Argv


}