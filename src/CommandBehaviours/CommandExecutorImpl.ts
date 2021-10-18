import {SelfError} from "../SelfError";
import {ICommandHandler} from "./ICommandHandler";
import {MessageLike} from "./MessageLike";
import {ICommandExecutor} from "./ICommandExecutor";

export class CommandExecutorImpl implements ICommandExecutor {
    private commands: Map<string, ICommandHandler> = new Map();

    bind(name: string, handler: ICommandHandler) {
        this.commands.set(name, handler);
    }

    async executeCommand(message: MessageLike, name: string, args: string[]) {
        const handler = this.commands.get(name);
        if (!handler) {
            throw new SelfError('command not found');
        }
        await handler.handle(message, args);
    }

    getHandlers(): [string, ICommandHandler][] {
        return [...this.commands.entries()];
    }
}