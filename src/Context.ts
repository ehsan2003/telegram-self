import {Common} from "./Common";
import {Logger, TelegramClient} from "telegram";
import {PrismaClient} from "@prisma/client";
import {EventCommon} from "telegram/events/common";
import {Subject} from "rxjs";
import {ProcessManager} from "./Processes/ProcessManager";

export interface Context {
    client: TelegramClient;
    prisma: PrismaClient;
    common: Common;
    logger: Logger;
    eventsSubject: Subject<EventCommon>
    processManager: ProcessManager
}
