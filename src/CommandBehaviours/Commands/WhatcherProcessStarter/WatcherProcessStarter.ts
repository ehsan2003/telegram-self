import {ICommandHandler} from "../../ICommandHandler";
import {Context} from "../../../Context";
import {NewMessageEvent} from "telegram/events";
import {WatcherProcess} from "../../../Processes/WatcherProcess";

export type WatcherProcessStarterArgs = {
    inputChat: string
    outputChat: string;
}

export class WatcherProcessStarter implements ICommandHandler {
    async handle(): Promise<void> {
        const inputChat = await this.ctx.client.getPeerId(isNaN(+this.args.inputChat) ? this.args.inputChat : +this.args.inputChat,false)

        const outputChat = await this.ctx.client.getPeerId(isNaN(+this.args.outputChat) ? this.args.outputChat : +this.args.outputChat,false)

        this.ctx.processManager.run(new WatcherProcess(this.ctx, {chatId: inputChat, forwardTo: outputChat}))

    }

    constructor(private ctx: Context, private event: NewMessageEvent, private args: WatcherProcessStarterArgs) {

    }

}