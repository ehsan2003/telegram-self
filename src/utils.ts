import * as Joi from "joi";
import {SelfError} from "./SelfError";
import {SendMessageParams} from "telegram/client/messages";
import {Api} from "telegram";

export function validateJoi(validator: Joi.Schema, value: any) {
    const {error, value: validated} = validator.validate(value, {stripUnknown: true});
    if (error) {
        throw new SelfError(error.message);
    }
    return validated;
}

export function prepareLongMessage(text: string): SendMessageParams {
    if (text.length >= 4000) {
        return {
            file: Buffer.from(text),
            message: "debug",
        };
    } else {
        return {
            message: "<pre>" + text + "</pre>",
            parseMode: 'html',
        };
    }
}

export const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key: string, value: any) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    };
};

export function getPeerId(peer: Api.TypePeer) {
    switch (peer.className) {
        case "PeerChannel":
            return peer.channelId;
        case "PeerChat":
            return peer.chatId;
        case "PeerUser":
            return peer.userId;
    }
}

export function getFormattingEntitiesFromRawJson(raw: Omit<Api.TypeMessageEntity, 'getBytes'>[]): Api.TypeMessageEntity[] {
    const entityConstructorMap = {
        'MessageEntityUnknown': Api.MessageEntityUnknown,
        'MessageEntityMention': Api.MessageEntityMention,
        'MessageEntityHashtag': Api.MessageEntityHashtag,
        'MessageEntityBotCommand': Api.MessageEntityBotCommand,
        'MessageEntityUrl': Api.MessageEntityUrl,
        'MessageEntityEmail': Api.MessageEntityEmail,
        'MessageEntityBold': Api.MessageEntityBold,
        'MessageEntityItalic': Api.MessageEntityItalic,
        'MessageEntityCode': Api.MessageEntityCode,
        'MessageEntityPre': Api.MessageEntityPre,
        'MessageEntityTextUrl': Api.MessageEntityTextUrl,
        'MessageEntityMentionName': Api.MessageEntityMentionName,
        'InputMessageEntityMentionName': Api.InputMessageEntityMentionName,
        'MessageEntityPhone': Api.MessageEntityPhone,
        'MessageEntityCashtag': Api.MessageEntityCashtag,
        'MessageEntityUnderline': Api.MessageEntityUnderline,
        'MessageEntityStrike': Api.MessageEntityStrike,
        'MessageEntityBlockquote': Api.MessageEntityBlockquote,
        'MessageEntityBankCard': Api.MessageEntityBankCard,
    }
    return raw.map(e => new entityConstructorMap[e.className](e as any))
}