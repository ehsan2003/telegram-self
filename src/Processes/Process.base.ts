import {Context} from "../Context";

export abstract class Process<T = any> {
    constructor(protected ctx: Context, protected args: T) {
    }

    /**
     * don't call it ( unless in ProcessManager )
     */
    abstract _start(): any;

    /**
     * don't call it ( unless in ProcessManager )
     */
    abstract _clear(): any;

}