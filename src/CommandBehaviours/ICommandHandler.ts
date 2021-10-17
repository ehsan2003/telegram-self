import {MessageLike} from "./MessageLike";

export interface ICommandHandler {
    handle(messageLike: MessageLike, args: string[]): Promise<void>;

    getShortHelp(): string;
}