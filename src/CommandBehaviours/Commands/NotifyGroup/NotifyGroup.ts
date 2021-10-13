import {ICommandHandler} from "../../ICommandHandler";
import {Context} from "../../../Context";
import {NewMessageEvent} from "telegram/events";
import {SelfError} from "../../../SelfError";
import {NotifyBase, NotifyBaseArgs} from "../Notify.base";
import {intersectionBy} from "lodash";


export type NotifyGroupArgs = { groupName: string; } & NotifyBaseArgs;

export class NotifyGroup extends NotifyBase implements ICommandHandler {
    async handle(): Promise<void> {
        const group = await this.ctx.prisma.userGroup.findUnique({where: {name: this.args.groupName}});
        if (!group) {
            throw new SelfError('group does not exists');
        }
        const groupMembers = await this.ctx.prisma.userGroupMember.findMany({where: {groupId: group.id}})
        const participants = await this.ctx.client.getParticipants(this.event.chatId!, {});
        const intersection = intersectionBy(participants, groupMembers, (v) => 'userId' in v ? v.userId : v.id);
        await this.notifyUsers(intersection)
    }

    constructor(protected ctx: Context, protected event: NewMessageEvent, protected args: NotifyGroupArgs) {
        super(ctx, event, args)
    }

}