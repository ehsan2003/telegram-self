import {ICommandHandler} from "../../../ICommandHandler";
import {PreparedText, PreparedTextCategory} from '@prisma/client'
import {MessageLike} from "../../../MessageLike";
import {Context} from "../../../../Context";
import {table as drawTable} from "table";

export class PreparedTextList implements ICommandHandler {
    getHelp(): string {
        return "";
    }

    getShortHelp(): string {
        return "";
    }

    async handle(messageLike: MessageLike, args: string[]): Promise<void> {
        const texts = await this.ctx.prisma.preparedText.findMany({include: {tags: true}});
        const table = this.generateText(texts);
        await this.ctx.common.tellUser(table);
    }

    private generateText(texts: (PreparedText & { tags: PreparedTextCategory[] })[]) {
        return drawTable([['id', 'tags'], ...texts.map(t => [t.identifier, t.tags.map(t => t.name).join(',')])]);
    }

    constructor(private ctx: Context) {
    }

}