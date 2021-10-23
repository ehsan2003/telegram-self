import {BaseCommandHandler} from "../../BaseCommandHandler";
import yargsParser from "yargs-parser";
import {MessageLike} from "../../MessageLike";
import {SelfError} from "../../../SelfError";
import {getPeerId, validateJoi} from "../../../utils";
import {Api} from "telegram";
import {stringify} from "yaml";
import * as Joi from 'joi';

type DebugUserArgs = {
    full: boolean;
}

export class DebugUser extends BaseCommandHandler<DebugUserArgs> {
    protected async execute(message: MessageLike, validatedArgs: DebugUserArgs): Promise<void> {
        const userId = await this.getUserIdBasedOnMessage(message);
        const user = await this.getUser(validatedArgs, userId);
        await this.ctx.common.tellUser(stringify(user))
    }

    private async getUser(validatedArgs: DebugUserArgs, userId: number) {
        if (validatedArgs.full) {
            return await this.ctx.client.invoke(new Api.users.GetFullUser({id: userId}))
        } else {
            return await this.ctx.client.invoke(new Api.users.GetUsers({id: [userId]})).then(e => e[0]) as Api.User | Api.UserFull;
        }
    }

    private async getUserIdBasedOnMessage(message: MessageLike): Promise<number> {
        const replyId = message.getReplyToId();
        if (replyId) {
            const reply = await message.getReplyTo();
            if (!reply) {
                throw new SelfError('reply deleted');
            }
            return getPeerId(reply.fromId!);
        } else {
            const mentionedUsers = await message.getMentionedUsers()
            const firstMentionedUser = mentionedUsers[0];
            if (!firstMentionedUser) {
                throw new SelfError('debug user must have a mention or a reply');
            }
            return firstMentionedUser.id;
        }
    }

    protected getArgsParserOptions(): yargsParser.Options {
        return {
            boolean: ['full'],
            alias: {
                full: 'f'
            }
        }
    }

    getHelp(): string {
        return "";
    }

    getShortHelp(): string {
        return "";
    }

    protected validateParsedArgs(parsedArgs: yargsParser.Arguments): Promise<DebugUserArgs> | DebugUserArgs {
        return validateJoi(Joi.object({full: Joi.boolean().default(false)}), parsedArgs);
    }

}