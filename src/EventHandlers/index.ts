import {Context} from "../Context";
import {DebugMessageFactory} from "./Commands/DebugMessage";
import {EventHandlerFactory} from "./EventHandlerFactory.base";
import {DeleteMeFactory} from "./Commands/DeleteMe";
import {FancyTypeFactory} from "./Commands/FancyType";
import {PreparedTextFactory} from "./Commands/PreparedTextHandler";

export async function getFactories(ctx: Context): Promise<EventHandlerFactory[]> {
    return [
        new DebugMessageFactory(ctx),
        new DeleteMeFactory(ctx),
        new FancyTypeFactory(ctx),
        new PreparedTextFactory(ctx)
    ];
}
