import * as Joi from "joi";
import {SelfError} from "./SelfError";
import {SendMessageParams} from "telegram/client/messages";
import {Api} from "telegram";
import {NewMessageEvent} from "telegram/events";
import {MessageLike} from "./CommandBehaviours/MessageLike";

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
            message: "```" + text + "```",
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

export function getMessageLikeFromNewMessageEvent(event: NewMessageEvent): MessageLike {
    return {
        chatId: event.chatId!,
        replyTo: event.message.replyToMsgId,
        messageId: event.message.id
    }
}