import {Context} from "../Context";
import {CommandExecutor} from "./CommandExecutor";
import {DebugMessage} from "./Commands/DebugMessage/DebugMessage";

export function createCommandExecutor(ctx: Context): CommandExecutor {
    const executor = new CommandExecutor(ctx);
    // executor.bind('debugmsg', new DebugMessageFactory(ctx));
    // executor.bind('spam', new SpamStarterFactory(ctx));
    // executor.bind('pstats', {createHandler: (event) => new ProcessStats(ctx, event, {})});
    // executor.bind('pstop', new ProcessStopperFactory(ctx));
    // executor.bind('deleteme', new DeleteMeFactory(ctx));
    // executor.bind('notifyall', new NotifyAllRepresentation(ctx))
    // executor.bind('text', new PreparedTextSenderRepresentation(ctx));
    // executor.bind('notifygroup', new NotifyGroupRepresentation(ctx));
    // executor.bind('notifyadmins', new NotifyAdminsRepresentation(ctx));
    // executor.bind('watch', new WatcherProcessStarterRepresentation(ctx));
    // place factories here
    executor.bind('debugmsg', new DebugMessage(ctx));
    return executor;
}