import * as Joi from "joi";
import {SelfError} from "./SelfError";
import {SendMessageParams} from "telegram/client/messages";

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