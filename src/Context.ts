import {Common} from "./Common";
import {Api, Logger, TelegramClient} from "telegram";
import {PrismaClient} from "@prisma/client";
import {Subject} from "rxjs";
import {ProcessManager} from "./Processes/ProcessManager";

export interface Context {
    client: TelegramClient;
    prisma: PrismaClient;
    common: Common;
    logger: Logger;
    eventsSubject: Subject<Api.TypeUpdate>
    processManager: ProcessManager
}
