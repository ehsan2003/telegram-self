import {CommandHandlerBase} from "./CommandHandler.base";
import {NewMessageEvent} from "telegram/events";
import yargs, {Arguments} from "yargs";
import {SelfError} from "../../SelfError";
import {helpers} from "telegram";
import ms = require('ms');

type Args = {
    delay: number;
}

export class FancyType extends CommandHandlerBase<Args> {
    async execute(event: NewMessageEvent, args: Arguments<Args>): Promise<void> {
        this.validateOrFail(args);

        const text = args._[0].toString();
        const frames = this.getFrames(text);
        for (const frame of frames) {
            await event.message.edit({text: frame})
            await helpers.sleep(args.delay);
        }
    }

    private getFrames(text: string): string[] {
        const parts = text.split(/\s+/);
        const result = [];
        let previous: string | undefined;
        for (let i = 1; i <= parts.length; i++) {
            const frameText = parts.slice(0, i).join(' ').trim();
            if (previous !== frameText) {
                previous = frameText;
                result.push(frameText);
            }
        }
        return result;
    }

    private validateOrFail(args: Arguments<Args>) {
        if (!args._[0]) {
            throw new SelfError('argument required');
        }
    }

    getArgumentParser(): yargs.Argv<Args> {
        return yargs.option('delay', {
            alias: 'd'
            , coerce: (value: string) => ms(value)
            , string: true
            , default: 500
        });
    }

    getName(): string {
        return "type";
    }
}