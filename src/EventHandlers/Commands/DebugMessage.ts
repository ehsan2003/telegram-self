import {CommandHandlerBase} from "./CommandHandler.base";
import yaml from 'yaml';
import yargs from "yargs";
import {NewMessageEvent} from "telegram/events";
import {Message} from "telegram/tl/custom/message";
import _ from 'lodash';
import {SelfError} from "../../SelfError";
import {CommandHandlerFactory} from "./CommandHandlerFactory.base";

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
    async execute(): Promise<void> {
        const reply = await this.getReply(this.event);

        const msgToSend = this.ctx.common.prepareLongMessage(
            this.stringifyReply(reply)
        );

        await this.ctx.client.sendMessage(this.args.chat ? this.event.chatId! : "me", {
            ...msgToSend,
            replyTo: this.args.chat ? this.event.message.id : undefined,
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


}

export class DebugMessageFactory extends CommandHandlerFactory {
    createInstance(event: NewMessageEvent, args: yargs.Arguments<Args>): Promise<CommandHandlerBase<Args>> {
        return Promise.resolve(new DebugHandler(this.ctx, event, args));
    }

    getArgumentParser(): yargs.Argv<Args> {
        return yargs.option('chat', {alias: 'c', boolean: true});
    }

    getName(): string {
        return "debugmsg";
    }

}