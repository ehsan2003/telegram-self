import {Process} from "./Process.base";
import {SelfError} from "../SelfError";

export interface ProcessRepresentation {
    name?: string;
    id: number;
    process: Process;
    startedAt: Date;
}

export class ProcessManager {
    private processes: ProcessRepresentation[] = [];

    /**
     * starts a process and returns it's processId
     * @param process
     * @param name
     */
    run(process: Process, name?: string) {
        if (name && this.getProcessRepresentationByName(name)) throw new SelfError(`duplicate name ${name}`);

        const pid = this.getRandomPid();
        this.processes.unshift({process, name, id: pid, startedAt: new Date()});
        process._start();
    }

    private getRandomPid() {
        // return _.random(1, 1000, false);
        return 1;
    }

    public stopByName(name: string) {
        const processId = this.getProcessRepresentationByName(name)?.id;
        if (!processId) {
            throw new SelfError('no such process');
        }
        this.stop(processId);
    }

    stop(processId: number) {
        const process = this.getProcessRepresentationById(processId)?.process;

        if (process) {
            process._clear();
            this.processes.splice(processId, 1);
        } else {
            throw new SelfError('no such process');
        }
    }

    private getProcessRepresentationByName(name: string) {
        return this.processes.find(process => process.name === name)
    }

    private getProcessRepresentationById(id: number) {
        return this.processes.find(process => process.id === id);
    }

    public getStats(): string {
        return 'id\tname\tdate\n' +
            this.processes.map(processRepresentation => `${processRepresentation.id}\t${processRepresentation.name}\t${processRepresentation.startedAt.toISOString()}`).join('\n');
    }
}
