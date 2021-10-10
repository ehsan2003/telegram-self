import {CommandHandlerBase} from "./CommandHandler.base";
import yaml from 'yaml';
import yargs from "yargs";
import {NewMessageEvent} from "telegram/events";
import {Message} from "telegram/tl/custom/message";
import _ from 'lodash';
import {SelfError} from "../../SelfError";

const getCircularReplacer = () => {
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

interface Args {
    chat?: boolean;
}

export class DebugHandler extends CommandHandlerBase<Args> {
    async execute(event: NewMessageEvent, args: Args): Promise<void> {
        const reply = await this.getReply(event);

        const msgToSend = this.ctx.common.prepareLongMessage(
            this.stringifyReply(reply)
        );

        await this.ctx.client.sendMessage(args.chat ? event.chatId! : "me", {
            ...msgToSend,
            replyTo: args.chat ? event.message.id : undefined,
        });
    }

    private async getReply(event: NewMessageEvent) {
        const reply = await event.message.getReplyMessage();
        if (!reply) {
            throw new SelfError('message must have a reply')
        }
        return reply;
    }

    private stringifyReply(reply: Message): string {
        return yaml.stringify(JSON.parse(JSON.stringify(_.omit(reply, ["_eventBuilders", "_client", "client"]), getCircularReplacer())));
    }

    getArgumentParser(): yargs.Argv<Args> {
        return yargs.option('chat', {alias: 'c', boolean: true});
    }

    getName(): string {
        return "debugmsg";
    }
}
