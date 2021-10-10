import {SendMessageParams} from "telegram/client/messages";
import {TelegramClient} from "telegram";
import {PreparedText, PrismaClient} from '@prisma/client'
import _ from "lodash";
import {SelfError} from "./SelfError";

export class Common {
    constructor(protected client: TelegramClient, protected prisma: PrismaClient) {
    }

    public async getRandomTextByCategory(categoryName: string) {
        const category = await this.prisma.preparedTextCategory.findFirst({where: {name: categoryName}});

        if (!category) {
            throw new SelfError('category not found');
        }

        const preparedTexts = await this.prisma.preparedText.findMany({where: {tags: {some: {name: categoryName}}}});

        if (!preparedTexts.length) {
            throw new SelfError('category is empty');
        }

        return _.sample(preparedTexts) as PreparedText;
    }

    public prepareLongMessage(text: string): SendMessageParams {
        if (text.length >= 4000) {
            return {
                file: Buffer.from(text),
                message: "debug",
            };
        } else {
            return {
                message: "```" + text + "```",
            };
        }
    }

    public async sendError(msg: string) {
        await this.client.sendMessage('me', this.prepareLongMessage(msg));
    }
}
