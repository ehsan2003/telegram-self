import {Context} from "../Context";
import {EventHandler} from "./EventHandler.base";
import {DebugHandler} from "./Commands/DebugMessage";
import {PreparedTextHandler} from "./Commands/PreparedTextHandler";
import {FancyType} from "./Commands/FancyType";
import {DeleteMe} from "./Commands/DeleteMe";

export async function getHandlers(ctx: Context): Promise<EventHandler<any>[]> {
    return [
        new DebugHandler(ctx),
        new PreparedTextHandler(ctx),
        new FancyType(ctx),
        new DeleteMe(ctx),
    ];
}
