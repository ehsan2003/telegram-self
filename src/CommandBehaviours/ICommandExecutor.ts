import {ICommandHandler} from "./ICommandHandler";
import {MessageLike} from "./MessageLike";

export interface ICommandExecutor {
    bind(name: string, handler: ICommandHandler): void;

    executeCommand(message: MessageLike, name: string, args: string[]): Promise<void>;

    getHandlers(): [string, ICommandHandler][];
}