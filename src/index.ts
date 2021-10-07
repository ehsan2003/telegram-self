import {Context} from "./Context";
import dotenv from "dotenv";
import {PrismaClient} from ".prisma/client";
import {initializeClient} from "./initializeClient";
import {getHandlers} from "./EventHandlers";
import {Common} from "./Common";
import {Logger} from "telegram";
import {SelfError} from "./SelfError";

dotenv.config({debug: true});

if (!process.env.API_ID || isNaN(+process.env.API_ID)) {
    console.error("API_ID is not set in environment");
    process.exit(1);
}
if (!process.env.API_HASH) {
    console.error("API_HASH is not set in environment");
    process.exit(1);
}

async function createContext(): Promise<Context> {
    return {
        client: await initializeClient(),
        prisma: new PrismaClient(),
        common: new Common(),
        logger: new Logger("warn"),
    };
}

async function main() {
    const ctx = await createContext();
    const allHandlers = await getHandlers(ctx);
    console.log("running");
    for (const handler of allHandlers) {
        ctx.client.addEventHandler(async (event) => {
            try {
                if (await handler.shouldHandle(event)) await handler.handle(event);
            } catch (e) {
                if (e instanceof SelfError) {
                    await event.message.delete({})
                    await ctx.common.sendError(ctx.client, e.message);
                    console.log(e);
                } else {
                    throw e;
                }
            }

        }, handler.getNewMessage());
    }
}


// noinspection JSIgnoredPromiseFromCall
main();
