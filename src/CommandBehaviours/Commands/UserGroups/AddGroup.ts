import {ICommandHandler} from "../../ICommandHandler";
import {Context} from "../../../Context";
import {MessageLike} from "../../MessageLike";
import {SelfError} from "../../../SelfError";

export class AddGroup implements ICommandHandler {
    getHelp(): string {
        return "";
    }

    getShortHelp(): string {
        return "";
    }

    async handle(messageLike: MessageLike, args: string[]): Promise<void> {
        const groupName = args[0]
        if (!groupName) {
            throw new SelfError('group name is required');
        }
        await this.ctx.prisma.userGroup.upsert({
            where: {name: groupName},
            create: {name: groupName},
            update: {name: groupName}
        });
    }

    constructor(private ctx: Context) {
    }
}