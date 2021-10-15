import {Context} from "./Context";
import dotenv from "dotenv";
import {PrismaClient} from ".prisma/client";
import {initializeClient} from "./initializeClient";
import {Common} from "./Common";
import {Api, Logger} from "telegram";
import {SelfError} from "./SelfError";
import {NewMessage, NewMessageEvent} from "telegram/events";
import {Subject} from "rxjs";
import {ProcessManager} from "./Processes/ProcessManager";
import parseArgsStringToArgv from "string-argv";
import {createCommandExecutor} from "./CommandBehaviours/createCommandExecutor";
import {prepareLongMessage} from "./utils";

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
    const eventsSubject = new Subject<Api.TypeUpdate>();
    client.addEventHandler((event: Api.TypeUpdate) => eventsSubject.next(event))
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

async function handleError(e: any, event: NewMessageEvent, ctx: Context) {
    if (e instanceof SelfError) {
        const forwarded = await event.message.forwardTo('me');

        await event.message.delete({})
        await ctx.client.sendMessage('me', {...prepareLongMessage(e.message), replyTo: forwarded![0]!.id});
    } else {
        throw e;
    }
}

const commandPattern = /!([a-z]+)(\s(.*))?/;

function extractCommandAndArguments(message: string): { name: string, args: string[] } {
    const matchResult = message.match(commandPattern)!
    return {
        args: matchResult[3] ? parseArgsStringToArgv(matchResult[3]) : [],
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
