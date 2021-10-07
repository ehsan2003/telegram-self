import {NewMessage} from "telegram/events";
import {EventCommon} from "telegram/events/common";
import {Context} from "../Context";

export abstract class EventHandler<T extends EventCommon> {
    constructor(protected ctx: Context) {
    }

    abstract getNewMessage(): NewMessage;

    abstract shouldHandle(event: EventCommon): Promise<boolean>;

    abstract handle(event: T): Promise<void>;
}
