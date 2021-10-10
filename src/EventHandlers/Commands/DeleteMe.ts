import {CommandHandlerBase} from "./CommandHandler.base";
import {NewMessageEvent} from "telegram/events";
import yargs from "yargs";
import {CommandHandlerFactory} from "./CommandHandlerFactory.base";

export type Args = {
    count: number
}

export class DeleteMe extends CommandHandlerBase<Args> {
    async execute(): Promise<void> {
        console.log(this.args.count)
        await this.event.message.delete({})
        const myMessages = await this.getMyMessages()
        console.log('found messages:', this.args.count, myMessages.length);
        await this.ctx.client.deleteMessages(this.event.chatId!, myMessages.map(msg => msg.id), {});
    }

    private async getMyMessages() {
        return this.ctx.client.getMessages(this.event.chatId!, {
            fromUser: 'me',
            limit: this.args.count
        });
    }


}

export class DeleteMeFactory extends CommandHandlerFactory {
    createInstance(event: NewMessageEvent, args: yargs.Arguments<Args>): Promise<CommandHandlerBase<any>> {

        return Promise.resolve(new DeleteMe(this.ctx, event, args))
    }

    getArgumentParser(): yargs.Argv<Args> {
        return yargs.option('count', {number: true, alias: 'c', description: 'count to delete', default: 10})
    }

    getName(): string {
        return "deleteme";
    }

}