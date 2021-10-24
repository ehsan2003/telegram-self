import {Api} from "telegram/gramjs";

export interface MessageLike {
    getChatId(): number;

    getReplyToId(): number | undefined;

    getReplyTo(): Promise<Api.Message | undefined>;

    getEntities(): Api.TypeMessageEntity[];

    getMentionedUsers(): Promise<Api.User[]>;

    delete(): Promise<void>;

    edit(newText: string, formattingEntities?: Api.TypeMessageEntity[]): Promise<void>;
}