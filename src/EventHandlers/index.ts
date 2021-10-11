import {Context} from "../Context";
import {DebugMessageFactory} from "./Commands/DebugMessageHandler";
import {EventHandlerFactory} from "./EventHandlerFactory.base";
import {DeleteMeFactory} from "./Commands/DeleteMeHandler";
import {FancyTypeFactory} from "./Commands/FancyTypeHandler";
import {PreparedTextFactory} from "./Commands/PreparedTextHandler";
import {DownloadHandlerFactory} from "./Commands/DownloadHandler";
import {SpamStartHandlerFactory} from "./Commands/SpamStarter";
import {ProcessStopHandlerFactory} from "./Commands/ProcessStopHandler";

export async function getFactories(ctx: Context): Promise<EventHandlerFactory[]> {
    return [
        new DebugMessageFactory(ctx),
        new DeleteMeFactory(ctx),
        new FancyTypeFactory(ctx),
        new PreparedTextFactory(ctx),
        new DownloadHandlerFactory(ctx),
        new SpamStartHandlerFactory(ctx),
        new ProcessStopHandlerFactory(ctx)
    ];
}
