import {CommandHandlerBase} from "./CommandHandler.base";
import {NewMessageEvent} from "telegram/events";
import yargs from "yargs";

export type Args = {
    count: number
}

export class DeleteMe extends CommandHandlerBase<Args> {
    async execute(event: NewMessageEvent, {count}: yargs.Arguments<Args>): Promise<void> {
        console.log(count)
        await event.message.delete({})
        const myMessages = await this.getMyMessages(event, count)
        console.log('found messages:', count, myMessages.length);
        await this.ctx.client.deleteMessages(event.chatId!, myMessages.map(msg => msg.id), {});
    }

    private async getMyMessages(event: NewMessageEvent, count: number) {
        return this.ctx.client.getMessages(event.chatId!, {
            fromUser: 'me',
            limit: count
        });
    }

    getArgumentParser(): yargs.Argv<Args> {
        return yargs.option('count', {number: true, alias: 'c', description: 'count to delete', default: 10})
    }

    getName(): string {
        return "deleteme";
    }
}