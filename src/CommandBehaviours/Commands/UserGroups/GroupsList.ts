import {ICommandHandler} from "../../ICommandHandler";
import {MessageLike} from "../../MessageLike";
import {Context} from "../../../Context";
import {table} from "table";

export class GroupsList implements ICommandHandler {
    getHelp(): string {
        return "";
    }

    getShortHelp(): string {
        return "";
    }

    async handle(messageLike: MessageLike, args: string[]): Promise<void> {
        const groups = await this.ctx.prisma.userGroup.findMany({});
        await this.ctx.common.tellUser(table([['group name'], ...groups.map(g => [g.name])]));
    }

    constructor(private ctx: Context) {
    }
}