import {ICommandHandler} from "./ICommandHandler";
import {NewMessageEvent} from "telegram/events";

export interface ICommandFactory {
    createHandler(event: NewMessageEvent, rawArguments: string[]): Promise<ICommandHandler> | ICommandHandler;
}