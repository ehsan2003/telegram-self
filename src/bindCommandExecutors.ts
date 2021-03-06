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
import {PreparedTextList} from "./CommandBehaviours/Commands/UtilityCommands/Text/PreparedTextList";
import {AddGroup} from "./CommandBehaviours/Commands/UserGroups/AddGroup";
import {GroupsList} from "./CommandBehaviours/Commands/UserGroups/GroupsList";
import {GroupMemberList} from "./CommandBehaviours/Commands/UserGroups/GroupMemberList";
import {DebugUser} from "./CommandBehaviours/Commands/UtilityCommands/DebugUser";
import {AddGroupMem} from "./CommandBehaviours/Commands/UserGroups/AddGroupMem";

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
    executor.bind('textls', new PreparedTextList(ctx));
    executor.bind('gpadd', new AddGroup(ctx));
    executor.bind('gpls', new GroupsList(ctx));
    executor.bind('gpmemls', new GroupMemberList(ctx));
    executor.bind('debuguser', new DebugUser(ctx));
    executor.bind('gpaddmem',new AddGroupMem(ctx));
}
