import {CommandHandlerBase} from "./CommandHandler.base";
import {CommandHandlerFactory} from "./CommandHandlerFactory.base";
import yargs from "yargs";
import {NewMessageEvent} from "telegram/events";
import axios from "axios";
import {CustomFile} from "telegram/client/uploads";


export type Args = {
    link: string;
}

export class DownloadHandler extends CommandHandlerBase<Args> {
    protected async execute(): Promise<void> {
        console.log('link', this.args.link);
        const response = await axios.get(this.args.link, {responseType: 'arraybuffer'});

        const buffer = Buffer.from(response.data);
        console.log(buffer);
        const uploaded = await this.ctx.client.uploadFile({
            file: new CustomFile(this.args.link, buffer.length, '', buffer), workers: 1
        });
        await this.event.message.reply({
            file: uploaded,
            message: this.args.link
        })
    }
}

export class DownloadHandlerFactory extends CommandHandlerFactory {
    createInstance(event: NewMessageEvent, args: yargs.Arguments<Args>): Promise<CommandHandlerBase<any>> {
        return Promise.resolve(new DownloadHandler(this.ctx, event, args));
    }

    protected getArgumentParser(): yargs.Argv<Args> {
        return yargs.option('link', {alias: 'l', demandOption: true, string: true,})
    }

    protected getName(): string {
        return "download";
    }

}