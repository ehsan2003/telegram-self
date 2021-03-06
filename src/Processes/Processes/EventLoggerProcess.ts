import {IProcess} from "../IProcess";
import {Subject} from "rxjs";
import {Context} from "../../Context";

export class EventLoggerProcess implements IProcess {
    constructor(protected ctx: Context) {
    }

    private clearSubject = new Subject();

    clear() {
        this.clearSubject.next(null);
    }

    start() {
        this.ctx.eventsSubject.subscribe(async event => {
            await this.ctx.prisma.log.create({data: {type: 'event', data: JSON.stringify(event)}});
        })
    }

}