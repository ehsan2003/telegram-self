import {Context} from "../Context";
import {SelfError} from "../SelfError";
import {NewMessageEvent} from "telegram/events";
import {ICommandHandler} from "./ICommandHandler";
import {getMessageLikeFromNewMessageEvent} from "../utils";

export class CommandExecutor {
    private commands: Map<string, ICommandHandler> = new Map();

    constructor(private ctx: Context) {}

    bind(name: string, handler: ICommandHandler) {
        this.commands.set(name, handler);
    }

    async executeCommand(event: NewMessageEvent, name: string, args: string[]) {
        const handler = this.commands.get(name);
        if (!handler) {
            throw new SelfError('command not found');
        }
        await handler.handle(getMessageLikeFromNewMessageEvent(event), args);
    }
}