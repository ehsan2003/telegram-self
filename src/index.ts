import {Context} from "./Context";
import dotenv from "dotenv";
import {PrismaClient} from ".prisma/client";
import {initializeClient} from "./initializeClient";
import {Common} from "./Common";
import {Api, Logger} from "telegram/gramjs";
import {SelfError} from "./SelfError";
import {NewMessage, NewMessageEvent} from "telegram/gramjs/events";
import {Subject} from "rxjs";
import {ProcessManager} from "./Processes/ProcessManager";
import parseArgsStringToArgv from "string-argv";
import {bindCommandExecutors} from "./bindCommandExecutors";
import {prepareLongMessage} from "./utils";
import {CommandExecutorImpl} from "./CommandBehaviours/CommandExecutorImpl";
import {RealMessageLike} from "./RealMessageLike";

dotenv.config({debug: true});

function validateEnvironmentVariablesOrExit() {
    if (!process.env.API_ID || isNaN(+process.env.API_ID)) {
        console.error("API_ID is not set in environment");
        process.exit(1);
    }
    if (!process.env.API_HASH) {
        console.error("API_HASH is not set in environment");
        process.exit(1);
    }
    if (!process.env.SESSION_STR) {
        console.error('SESSION_STR is not set in environment ( use npx tgsession to generate the session )');
    }
}

validateEnvironmentVariablesOrExit();

async function createContext(): Promise<Context> {
    const logger = new Logger();
    const client = await initializeClient(logger);
    const eventsSubject = new Subject<Api.TypeUpdate>();
    client.addEventHandler((event: Api.TypeUpdate) => eventsSubject.next(event))
    const prisma = new PrismaClient();

    return {
        client: client,
        prisma: prisma,
        common: new Common(client, prisma),
        logger: logger,
        eventsSubject: eventsSubject,
        processManager: new ProcessManager(),
        commandExecutor: new CommandExecutorImpl()
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
    validateEnvironmentVariablesOrExit()
    const ctx = await createContext();
    bindCommandExecutors(ctx);

    ctx.logger.info('running');
    ctx.client.addEventHandler(async (event) => {
        const {args, name} = extractCommandAndArguments(event.message.message!);
        ctx.logger.info(`event "${name}" happened with args :${JSON.stringify(args)}`);
        try {
            await ctx.commandExecutor.executeCommand(new RealMessageLike(ctx, event.message), name, args);
        } catch (e) {
            await handleError(e, event, ctx);
        }

    }, new NewMessage({outgoing: true, pattern: commandPattern}));

}

// noinspection JSIgnoredPromiseFromCall
main();
