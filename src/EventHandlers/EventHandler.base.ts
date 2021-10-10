import {NewMessage} from "telegram/events";
import {EventCommon} from "telegram/events/common";
import {Context} from "../Context";

export abstract class EventHandler {
    constructor(protected ctx: Context) {}

    abstract getNewMessage(): NewMessage;

    abstract shouldHandle(event: EventCommon): Promise<boolean>;

    abstract handle(event: EventCommon): Promise<void>;
}
