import {Context} from "../Context";
import {DebugMessage} from "./Commands/DebugMessage/DebugMessage";
import {DeleteMe} from "./Commands/DeleteMe/DeleteMe";
import {NotifyAdmins} from "./Commands/NotifyAdmins/NotifyAdmins";
import {NotifyAll} from "./Commands/NotifyAll/NotifyAll";
import {NotifyGroup} from "./Commands/NotifyGroup/NotifyGroup";
import {ProcessStats} from "./Commands/PorcessStats/ProcessStats";
import {PreparedTextSender} from "./Commands/PreparedTextSender/PreparedTextSender";
import {ProcessStopper} from "./Commands/ProcessStopper/ProcessStopper";
import {SpamStarter} from "./Commands/SpamStarter/SpamStarter";
import {WatcherProcessStarter} from "./Commands/WhatcherProcessStarter/WatcherProcessStarter";
import {EventLoggerStarter} from "./Commands/EventLoggerStarter";
import {Help} from "./Commands/Help/Help";

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

}