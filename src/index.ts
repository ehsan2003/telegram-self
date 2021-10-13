import {Context} from "./Context";
import dotenv from "dotenv";
import {PrismaClient} from ".prisma/client";
import {initializeClient} from "./initializeClient";
import {Common} from "./Common";
import {Logger} from "telegram";
import {SelfError} from "./SelfError";
import {NewMessage} from "telegram/events";
import {Subject} from "rxjs";
import {EventCommon} from "telegram/events/common";
import {ProcessManager} from "./Processes/ProcessManager";
import parseArgsStringToArgv from "string-argv";
import {createCommandExecutor} from "./CommandBehaviours/createCommandExecutor";

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
    const client = await initializeClient();
    const eventsSubject = new Subject<EventCommon>();
    client.addEventHandler((event: EventCommon) => eventsSubject.next(event))
    const prisma = new PrismaClient();
    return {
        client: client,
        prisma: prisma,
        common: new Common(client, prisma),
        logger: new Logger("warn"),
        eventsSubject: eventsSubject,
        processManager: new ProcessManager()
    };
}

async function handleError(e: any, event: any, ctx: Context) {
    if (e instanceof SelfError) {
        await event.message.delete({})
        await ctx.common.tellUser(e.message);
        console.log(e);
    } else {
        throw e;
    }
}

const commandPattern = /!([a-z]+)(\s(.*))?/;

function extractCommandAndArguments(message: string): { name: string, args: string[] } {
    const matchResult = message.match(commandPattern)!
    return {
        args: parseArgsStringToArgv(matchResult[3]),
        name: matchResult[1]
    }
}

async function main() {
    const ctx = await createContext();
    const executor = createCommandExecutor(ctx);

    ctx.logger.info('running');
    ctx.client.addEventHandler(async (event) => {
        const {args, name} = extractCommandAndArguments(event.message.message!);
        ctx.logger.info(`event "${name}" happened with args :${JSON.stringify(args)}`);
        try {
            await executor.executeCommand(event, name, args);
        } catch (e) {
            await handleError(e, event, ctx);
        }

    }, new NewMessage({outgoing: true, pattern: commandPattern}));

}

// noinspection JSIgnoredPromiseFromCall
main();
