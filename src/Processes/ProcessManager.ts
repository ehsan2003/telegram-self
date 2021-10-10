import {Process} from "./Process.base";
import {SelfError} from "../SelfError";
import _ from 'lodash';

export class ProcessManager {
    private processes = new Map<number, Process<any>>();

    run(process: Process<any>) {
        this.processes.set(_.random(1, 1000, false), process);
        process._start();
    }

    getIds() {
        return this.processes.keys();
    }

    stop(pid: number) {
        const process = this.processes.get(pid);
        if (process) {
            process.clear();
            this.processes.delete(pid);
        } else {
            throw new SelfError('no such process');
        }
    }

}