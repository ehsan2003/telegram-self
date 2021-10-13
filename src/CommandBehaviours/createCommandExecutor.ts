import {Context} from "../Context";
import {CommandExecutor} from "./CommandExecutor";
import {DebugMessageFactory} from "./Commands/DebugMessage/DebugMessageFactory";
import {SpamStarterFactory} from "./Commands/SpamStarter/SpamStarterFactory";

export function createCommandExecutor(ctx: Context): CommandExecutor {
    const executor = new CommandExecutor(ctx);
    executor.bind('debugmsg', new DebugMessageFactory(ctx));
    executor.bind('spam', new SpamStarterFactory(ctx));
    // place factories here
    return executor;
}