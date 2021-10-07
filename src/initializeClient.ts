import {TelegramClient} from "telegram";
import {StoreSession} from "telegram/sessions";
import prompts from "prompts";


export async function initializeClient(): Promise<TelegramClient> {
    const session = new StoreSession("telegram_session");
    const client = new TelegramClient(
        session,
        +process.env.API_ID!,
        process.env.API_HASH!,
        {
            // proxy: {
            //     ip: "127.0.0.1",
            //     port: 9050,
            //     socksType:5,
            //     timeout: 30,
            // },
            useWSS: false,
        }
    );
    await client.start({
        password: () => prompts({
            name: "value",
            type: "password",
            message: "password",
        }).then((result) => result.value),
        onError: (err) => console.error("error", err),
        phoneNumber: () => prompts({
            name: "value",
            type: "text",
            message: "phone",
        }).then((result) => result.value),
        phoneCode: () => prompts({
            name: "value",
            type: "text",
            message: "code",
        }).then((result) => result.value),
    });

    return client;
}
