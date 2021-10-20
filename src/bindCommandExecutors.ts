import {Context} from "./Context";
import {DebugMessage} from "./CommandBehaviours/Commands/UtilityCommands/DebugMessage";
import {DeleteMe} from "./CommandBehaviours/Commands/UtilityCommands/DeleteMe";
import {NotifyAdmins} from "./CommandBehaviours/Commands/Notification/NotifyAdmins";
import {NotifyAll} from "./CommandBehaviours/Commands/Notification/NotifyAll";
import {NotifyGroup} from "./CommandBehaviours/Commands/Notification/NotifyGroup";
import {ProcessStats} from "./CommandBehaviours/Commands/ProcessHandling/ProcessStats";
import {PreparedTextSender} from "./CommandBehaviours/Commands/UtilityCommands/Text/PreparedTextSender";
import {ProcessStopper} from "./CommandBehaviours/Commands/ProcessHandling/ProcessStopper";
import {SpamStarter} from "./CommandBehaviours/Commands/ProcessHandling/SpamStarter";
import {WatcherProcessStarter} from "./CommandBehaviours/Commands/ProcessHandling/WatcherProcessStarter";
import {EventLoggerStarter} from "./CommandBehaviours/Commands/ProcessHandling/EventLoggerStarter";
import {Help} from "./CommandBehaviours/Commands/UtilityCommands/Help";
import {PreparedTextSetter} from "./CommandBehaviours/Commands/UtilityCommands/Text/PreparedTextSetter";

export function bindCommandExecutors(ctx: Context) {

    const {commandExecutor: executor} = ctx;

    executor.bind('debugmsg', new DebugMessage(ctx));
    executor.bind('deleteme', new DeleteMe(ctx));
    executor.bind('notifyadmins', new NotifyAdmins(ctx));
    executor.bind('notifyall', new NotifyAll(ctx));
    executor.bind('notifygroup', new NotifyGroup(ctx));
    executor.bind('pstats', new ProcessStats(ctx));
    executor.bind('text', new PreparedTextSender(ctx));
    executor.bind('pstop', new ProcessStopper(ctx));
    executor.bind('spam', new SpamStarter(ctx));
    executor.bind('watch', new WatcherProcessStarter(ctx));
    executor.bind('log', new EventLoggerStarter(ctx));
    executor.bind('help', new Help(ctx));
    executor.bind('textset', new PreparedTextSetter(ctx));

}