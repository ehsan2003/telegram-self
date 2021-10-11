import {Process} from "./Process.base";
import {interval, Subject, takeUntil, tap} from "rxjs";


export type Args = {
    interval: number;
    textCategory: string;
    chat: number;
}

export class SpamProcess extends Process<Args> {
    private exitSubject = new Subject<null>()

    _start(): any {
        console.log('starting process with args', this.args);
        interval(this.args.interval).pipe(
            takeUntil(this.exitSubject),
            tap(async () => {
                console.log('tapping')
                const text = await this.ctx.common.getRandomTextByCategory(this.args.textCategory)
                await this.ctx.client.sendMessage(this.args.chat, {message: text.text})
            })).subscribe(()=>{});
    }

    _clear(): any {
        this.exitSubject.next(null);
    }
}