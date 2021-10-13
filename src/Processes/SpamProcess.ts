import {IProcess} from "./IProcess";
import {interval, Subject, takeUntil, tap} from "rxjs";
import {Context} from "../Context";


export type SpamProcessArgs = {
    interval: number;
    textCategory: string;
    chatId: number;
}

export class SpamProcess implements IProcess {
    private exitSubject = new Subject<null>()

    constructor(protected ctx: Context, protected args: SpamProcessArgs) {
    }

    start(): any {
        console.log('starting process with args', this.args);
        interval(this.args.interval).pipe(
            takeUntil(this.exitSubject),
            tap(async () => {
                console.log('tapping')
                const text = await this.ctx.common.getRandomTextByCategory(this.args.textCategory)
                await this.ctx.client.sendMessage(this.args.chatId, {message: text.text})
            })).subscribe(() => {
        });
    }

    clear(): any {
        this.exitSubject.next(null);
    }
}