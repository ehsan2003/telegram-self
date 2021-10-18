import {ICommandHandler} from "../../ICommandHandler";
import {MessageLike} from "../../MessageLike";
import {Context} from "../../../Context";
import {table} from "table";

export class Help implements ICommandHandler {
    getHelp(): string {
        return "";
    }

    getShortHelp(): string {
        return "";
    }

    async handle(messageLike: MessageLike, args: string[]): Promise<void> {
        const cmdName = args[0];
        const helpMessage = this.getHelpMessage(cmdName);
        await this.ctx.common.tellUser(helpMessage);
    }

    private getHelpMessage(cmdName?: string) {
        if (cmdName) {
            const handler = this.ctx.commandExecutor.getHandlerByName(cmdName);
            return `${cmdName}:\n\n${handler.getHelp() || '< empty help >'}`;
        } else {
            const handlers = this.ctx.commandExecutor.getHandlers();
            return this.getTotalHelp(handlers);
        }
    }

    private getTotalHelp(handlers: [string, ICommandHandler][]): string {
        const tableData = [['name', 'help'], ...handlers.map(([name, handler]) => [name, handler.getHelp()])];
        return table(tableData, {columns: [{}, {width: 50, wrapWord: true,}]})
    }

    constructor(private ctx: Context) {
    }

}