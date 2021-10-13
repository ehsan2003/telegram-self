import {Context} from "../Context";
import {CommandExecutor} from "./CommandExecutor";
import {DebugMessageFactory} from "./Commands/DebugMessage/DebugMessageFactory";
import {SpamStarterFactory} from "./Commands/SpamStarter/SpamStarterFactory";
import {ProcessStatsFactory} from "./Commands/PorcessStats/ProcessStatsFactory";
import {ProcessStopperFactory} from "./Commands/ProcessStopper/ProcessStopperFactory";
import {DeleteMeFactory} from "./Commands/DeleteMe/DeleteMeFactory";
import {NotifyAllRepresentation} from "./Commands/NotifyAll/NotifyAllRepresentation";

export function createCommandExecutor(ctx: Context): CommandExecutor {
    const executor = new CommandExecutor(ctx);
    executor.bind('debugmsg', new DebugMessageFactory(ctx));
    executor.bind('spam', new SpamStarterFactory(ctx));
    executor.bind('pstats', new ProcessStatsFactory(ctx));
    executor.bind('pstop', new ProcessStopperFactory(ctx));
    executor.bind('deleteme', new DeleteMeFactory(ctx));
    executor.bind('notifyall', new NotifyAllRepresentation(ctx))
    // place factories here
    return executor;
}