import {Context} from "./Context";
import dotenv from "dotenv";
import {PrismaClient} from ".prisma/client";
import {initializeClient} from "./initializeClient";
import {getFactories} from "./EventHandlers";
import {Common} from "./Common";
import {Logger} from "telegram";
import {SelfError} from "./SelfError";
import {NewMessage} from "telegram/events";

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

async function handleError(e: any, event: any, ctx: Context) {
    if (e instanceof SelfError) {
        await event.message.delete({})
        await ctx.common.sendError(ctx.client, e.message);
        console.log(e);
    } else {
        throw e;
    }
}

async function main() {
    const ctx = await createContext();
    const allHandlers = await getFactories(ctx);
    console.log("running");

    ctx.client.addEventHandler(async (event) => {
        for (const handlerFactory of allHandlers) {
            try {
                if (await handlerFactory.canHandle(event)) await (await handlerFactory.createHandler(event)).handle();
            } catch (e) {
                await handleError(e, event, ctx);
            }
        }

    }, new NewMessage({}));

}

// noinspection JSIgnoredPromiseFromCall
main();
