import {TelegramClient} from "telegram";
import {PreparedText, PrismaClient} from '@prisma/client'
import _, {intersectionBy} from "lodash";
import {SelfError} from "./SelfError";
import {prepareLongMessage} from "./utils";
import {EntityLike} from "telegram/define";

export class Common {
    constructor(protected client: TelegramClient, protected prisma: PrismaClient) {
    }

    public async getRandomTextByCategory(categoryName: string) {
        const category = await this.prisma.preparedTextCategory.findFirst({where: {name: categoryName}});

        if (!category) {
            throw new SelfError('category not found');
        }

        const preparedTexts = await this.prisma.preparedText.findMany({where: {tags: {some: {name: categoryName}}}});

        if (!preparedTexts.length) {
            throw new SelfError('category is empty');
        }

        return _.sample(preparedTexts) as PreparedText;
    }

    public async tellUser(msg: string) {
        await this.client.sendMessage('me', prepareLongMessage(msg));
    }

    public async getUserGroupMembersInChat(chat: EntityLike, groupName: string) {
        const group = await this.prisma.userGroup.findUnique({where: {name: groupName}});
        if (!group) {
            throw new SelfError('group does not exists');
        }
        const groupMembers = await this.prisma.userGroupMember.findMany({where: {groupId: group.id}})
        const participants = await this.client.getParticipants(chat, {});
        return intersectionBy(participants, groupMembers, (v) => 'userId' in v ? v.userId : v.id);
    }
}
