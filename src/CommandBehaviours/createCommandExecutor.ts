import {Context} from "../Context";
import {CommandExecutor} from "./CommandExecutor";

export function createCommandExecutor(ctx: Context): CommandExecutor {
    const executor = new CommandExecutor(ctx);
    // place factories here
    return executor;
}