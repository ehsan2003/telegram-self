import {Context} from "../Context";
import {CommandExecutor} from "./CommandExecutor";
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
import {MessageLike} from "./MessageLike";

export function createCommandExecutor(ctx: Context): CommandExecutor {
    const executor = new CommandExecutor(ctx);

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

    executor.bind('help', {
        handle: async (messageLike: MessageLike, args: string[]) => {
            await executor.showHelp(args[0]);
        },
        getShortHelp(): string {
            return '!help [command name]        shows help';
        }, getHelp(): string {
            return `!help [command name]        shows help 
            
    shows help for specific command.
    if command not specified shows short help of all commands
            `;
        }
    })
    return executor;
}