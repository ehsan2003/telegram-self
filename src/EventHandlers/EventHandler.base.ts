import {EventCommon} from "telegram/events/common";
import {Context} from "../Context";

export abstract class EventHandler {
    protected constructor(protected ctx: Context, protected event: EventCommon) {
    }

    abstract handle(): Promise<void>;

}
