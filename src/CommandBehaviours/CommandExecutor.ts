import {ICommandFactory} from "./CommandFactory";
import {Context} from "../Context";
import {SelfError} from "../SelfError";
import {NewMessageEvent} from "telegram/events";

export class CommandExecutor {
    private commands: Map<string, ICommandFactory> = new Map();

    constructor(private ctx: Context) {
    }

    bind(name: string, factory: ICommandFactory) {
        this.commands.set(name, factory);
    }

    async executeCommand(event: NewMessageEvent, name: string, args: string[]) {
        const factory = this.commands.get(name);
        if (!factory) {
            throw new SelfError('command not found');
        }
        const command = await factory.createHandler(event, args);
        await command.handle();
    }
}