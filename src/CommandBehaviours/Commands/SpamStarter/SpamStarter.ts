import {ICommandHandler} from "../../ICommandHandler";
import {Context} from "../../../Context";
import {NewMessageEvent} from "telegram/events";
import {SpamProcess, SpamProcessArgs} from "../../../Processes/SpamProcess";
import {SelfError} from "../../../SelfError";
import {Arguments} from "yargs-parser";

export type SpamStarterArgs = {
    chat: string;
    interval: number;
    textCategory: string;
} & Arguments

export class SpamStarter implements ICommandHandler {
    constructor(private ctx: Context, private event: NewMessageEvent, private args: SpamStarterArgs) {
    }

    async handle(): Promise<void> {

        this.ctx.processManager.run(new SpamProcess(this.ctx, await this.getSpamProcessArguments()))
    }

    private async getSpamProcessArguments() {
        console.log(this.args)
        const chatId = isNaN(+this.args.chat) ? this.args.chat : +this.args.chat;
        const result: Partial<SpamProcessArgs> = {}
        const chat = await this.ctx.client.getEntity(chatId).catch(() => null);
        if (!chat) {
            throw new SelfError('chat not found');
        }
        result.chatId = chat.id;
        const category = await this.ctx.prisma.preparedTextCategory.findUnique({where: {name: this.args.textCategory}});
        if (!category) {
            throw new SelfError('text category not found');
        }
        result.textCategory = category.name;
        result.interval = this.args.interval;
        return result as SpamProcessArgs;
    }

}