import {IProcess} from "./IProcess";
import {SelfError} from "../SelfError";
import _ from 'lodash';
import {IProcessManager} from "./IProcessManager";

export interface ProcessRepresentation {
    name?: string;
    id: number;
    process: IProcess;
    startedAt: Date;
}

export class ProcessManager implements IProcessManager {
    private processes: ProcessRepresentation[] = [];

    /**
     * starts a process and returns it's processId
     * @param process
     * @param name
     */
    run(process: IProcess, name?: string) {
        if (name && this.getProcessRepresentationByName(name)) throw new SelfError(`duplicate name ${name}`);

        const pid = this.getNextPid();
        this.processes.unshift({process, name, id: pid, startedAt: new Date()});
        process.start();
    }

    private getNextPid() {
        return _.random(1, 1000, false);
        // return 1;
    }

    stopByName(name: string) {
        const processId = this.getProcessRepresentationByName(name)?.id;
        if (!processId) {
            throw new SelfError('no such process');
        }
        this.stop(processId);
    }

    stop(processId: number) {
        const process = this.getProcessRepresentationById(processId)?.process;

        if (process) {
            process.clear();
            this.processes = this.processes.filter(({process: Pin}) => Pin !== process);
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

    getProcesses(): ProcessRepresentation[] {
        return this.processes;
    }


}
