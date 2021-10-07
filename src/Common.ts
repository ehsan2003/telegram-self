import {SendMessageParams} from "telegram/client/messages";
import {TelegramClient} from "telegram";

export class Common {
    public prepareLongMessage(text: string): SendMessageParams {
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
    public async sendError(client:TelegramClient,msg:string){
        await client.sendMessage('me',this.prepareLongMessage(msg));
    }
}
