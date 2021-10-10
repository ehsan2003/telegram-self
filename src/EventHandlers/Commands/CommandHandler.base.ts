import {EventHandler} from "../EventHandler.base";
import {Context} from "../../Context";
import {NewMessageEvent} from "telegram/events";
import {Arguments} from "yargs";

export abstract class CommandHandlerBase<T> extends EventHandler {
    constructor(ctx: Context, protected event: NewMessageEvent, protected args: Arguments<T>) {
        super(ctx, event);
    }

    async handle() {
        await this.execute()
    }

    protected abstract execute(): Promise<void>
}