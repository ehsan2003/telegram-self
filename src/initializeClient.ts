import {Logger, TelegramClient} from "telegram/gramjs";
import {StringSession} from "telegram/gramjs/sessions";


export async function initializeClient(logger: Logger): Promise<TelegramClient> {
    const session = new StringSession(process.env.SESSION_STR as string);
    const client = new TelegramClient(
        session,
        +process.env.API_ID!,
        process.env.API_HASH!,
        {baseLogger: logger}
    );
    await client.connect();

    return client;
}
