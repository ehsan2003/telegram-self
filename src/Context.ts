import {Common} from "./Common";
import {Logger, TelegramClient} from "telegram";
import {PrismaClient} from "@prisma/client";

export interface Context {
    client: TelegramClient;
    prisma: PrismaClient;
    common: Common;
    logger: Logger;
}
