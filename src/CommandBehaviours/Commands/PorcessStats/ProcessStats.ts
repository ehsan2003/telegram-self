import {ICommandHandler} from "../../ICommandHandler";
import {Context} from "../../../Context";
import {ProcessRepresentation} from "../../../Processes/ProcessManager";
import {table} from "table";

export class ProcessStats implements ICommandHandler {
    constructor(private ctx: Context) {
    }

    async handle(): Promise<void> {
        const representations = this.ctx.processManager.getProcesses();
        const message = this.getMessage(representations);
        await this.ctx.common.tellUser(message);
    }

    private getMessage(processRepresentations: ProcessRepresentation[]): string {
        if (!processRepresentations.length) {
            return 'no running process';
        }

        const processesData = processRepresentations.map(processRepresentation => [
            processRepresentation.id,
            processRepresentation.name,
            processRepresentation.startedAt.toISOString()
        ]);

        const tableRows = [['id', 'name', 'date'], ...processesData];
        return table(tableRows)
    }

    getShortHelp(): string {
        return "";
    }

    getHelp(): string {
        return "";
    }

}