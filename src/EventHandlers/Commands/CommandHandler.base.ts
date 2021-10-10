import {EventHandler} from "../EventHandler.base";
import {NewMessage, NewMessageEvent} from "telegram/events";
import yargs from "yargs";
import {SelfError} from "../../SelfError";

export abstract class CommandHandlerBase<T> extends EventHandler {
    shouldHandle(event: NewMessageEvent): Promise<boolean> {
        return Promise.resolve(true);
    }

    async handle(event: NewMessageEvent): Promise<void> {
        const rawArguments = this.getRawArguments(event.message.message!)

        this.ctx.logger.info(`event "${this.getName()}" happened with arguments \`${rawArguments}\``);
        const args = await this.parseArguments(rawArguments);
        await this.execute(event, args);
    }


    private async parseArguments(rawArguments: string) {
        const parser = this.getArgumentParser().fail(false);
        try {
            return parser.parse(rawArguments)
        } catch {
            throw new SelfError(await parser.getHelp());
        }
    }

    private getRawArguments(messageText: string) {
        return messageText.match(this.getPattern())![1].trim();
    }

    getNewMessage(): NewMessage {
        return new NewMessage({
            pattern: this.getPattern(),
            outgoing: true,
        });
    }

    getPattern() {
        return new RegExp(`!${this.getName()}(.*)`);
    }

    protected abstract getName(): string;

    protected abstract getArgumentParser(): yargs.Argv<T>

    protected abstract execute(event: NewMessageEvent, args: yargs.Arguments<T>): Promise<void>
}