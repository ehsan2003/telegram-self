import {EventCommon} from "telegram/events/common";
import {EventHandler} from "./EventHandler.base";
import {Context} from "../Context";

export abstract class EventHandlerFactory {
    constructor(protected ctx: Context) {}

    canHandle(event: EventCommon): Promise<boolean> {
        return Promise.resolve(true);
    }

    abstract createHandler(event: EventCommon): Promise<EventHandler>;
}

