import {IProcess} from "./IProcess";
import {ProcessRepresentation} from "./ProcessManager";

export interface IProcessManager {
    /**
     * starts a process and returns it's processId
     * @param process
     * @param name
     */
    run(process: IProcess, name?: string): void;

    stopByName(name: string): void;

    stop(processId: number): void;

    getProcesses(): ProcessRepresentation[];
}