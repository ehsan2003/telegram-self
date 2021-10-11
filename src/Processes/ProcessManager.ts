import {Process} from "./Process.base";
import {SelfError} from "../SelfError";
import _ from 'lodash';

export class ProcessManager {
    private processes = new Map<number, Process<any>>();

    /**
     * starts a process and returns it's processId
     * @param process
     */
    run(process: Process<any>): number {
        const pid = _.random(1, 1000, false);
        this.processes.set(pid, process);
        process._start();
        return pid
    }

    getIds() {
        return this.processes.keys();
    }

    stop(processId: number) {
        const process = this.processes.get(processId);
        if (process) {
            process._clear();
            this.processes.delete(processId);
        } else {
            throw new SelfError('no such process');
        }
    }

}