import {Common} from "./Common";
import {Api, Logger, TelegramClient} from "telegram/gramjs";
import {PrismaClient} from "@prisma/client";
import {Subject} from "rxjs";
import {ICommandExecutor} from "./CommandBehaviours/ICommandExecutor";
import {IProcessManager} from "./Processes/IProcessManager";

export interface Context {
    client: TelegramClient;
    prisma: PrismaClient;
    common: Common;
    logger: Logger;
    eventsSubject: Subject<Api.TypeUpdate>
    processManager: IProcessManager;
    commandExecutor: ICommandExecutor;
}
