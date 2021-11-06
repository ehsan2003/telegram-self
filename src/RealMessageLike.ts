import {MessageLike} from "./CommandBehaviours/MessageLike";
import {Api} from "telegram";
import {CustomMessage} from "telegram/tl/custom/message";
import {Context} from "./Context";

type MentionTextEntity = Api.InputMessageEntityMentionName | Api.MessageEntityMentionName | Api.MessageEntityMention;

export class RealMessageLike implements MessageLike {
    constructor(private ctx: Context, private message: CustomMessage) {
    }

    async delete(): Promise<void> {
        await this.message.delete({})
    }

    async edit(newText: string, formattingEntities?: Api.TypeMessageEntity[]): Promise<void> {
        await this.message.edit({text: newText, formattingEntities});
    }

    getChatId(): number {
        return this.message.chatId!;
    }

    getEntities(): Api.TypeMessageEntity[] {
        return this.message.entities || [];
    }

    private isMentionEntity = (e: Api.TypeMessageEntity): e is MentionTextEntity => e.className === 'InputMessageEntityMentionName' || e.className === 'MessageEntityMention' || e.className === 'MessageEntityMentionName';

    async getMentionedUsers(): Promise<Api.User[]> {
        if (this.message.entities) {

            const mentions = this.message.entities.filter(this.isMentionEntity);
            return await this.getMentionedUsersBasedOnTextEntities(mentions);
        } else {
            return [];
        }
    }

    private getMentionedUsersBasedOnTextEntities(mentions: (Api.InputMessageEntityMentionName | Api.MessageEntityMentionName | Api.MessageEntityMention)[]) {
        return Promise.all(mentions.map(async m => {
            if (m.className === 'MessageEntityMention') {
                const username = this.message.message!.substr(m.offset + 1, m.length);
                return await this.resolveUsername(username);
            } else {
                const userId = this.getUserIdFromMention(m);
                return await this.resolveUserId(userId);
            }
        }));
    }

    private getUserIdFromMention(m: Api.InputMessageEntityMentionName | Api.MessageEntityMentionName) {
        return typeof m.userId === 'number' ? m.userId : (m.userId as Api.InputUserFromMessage).userId;
    }

    private async resolveUserId(userId: number) {
        const users = await this.ctx.client.invoke(new Api.users.GetUsers({id: [userId]}))
        return users[0] as Api.User;
    }

    private async resolveUsername(username: string) {
        const user = await this.ctx.client.invoke(new Api.contacts.ResolveUsername({username: username.trim()}));
        return user.users[0] as Api.User
    }

    async getReplyTo(): Promise<Api.Message | undefined> {
        if (!this.message.replyToMsgId) {
            return undefined;
        }
        const messages = await (this.message.isChannel ? this.getChannelReply() : this.getNormalReply());

        return (this.convertTypeMessagesToMessageArray(messages) || [])[0];
    }

    private convertTypeMessagesToMessageArray(messages: Api.messages.TypeMessages): Api.Message[] | undefined {
        if (messages.className === "messages.MessagesNotModified") {
            return undefined;
        } else {
            return messages.messages.filter((msg): msg is Api.Message => msg.className === 'Message');
        }
    }

    private async getNormalReply(): Promise<Api.messages.TypeMessages> {
        return this.ctx.client.invoke(new Api.messages.GetMessages({id: [new Api.InputMessageID({id: this.message.replyToMsgId!})]}))

    }

    private async getChannelReply(): Promise<Api.messages.TypeMessages> {
        return this.ctx.client.invoke(new Api.channels.GetMessages({
            channel: this.message.chatId, id: [new Api.InputMessageID({
                id: this.message.replyToMsgId!
            })]
        }));
    }


    getReplyToId(): number | undefined {
        return this.message.replyToMsgId;
    }

}