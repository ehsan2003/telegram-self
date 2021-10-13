export interface IProcess {
    /**
     * don't call it ( unless in ProcessManager )
     */
    start(): any;

    /**
     * don't call it ( unless in ProcessManager )
     */
    clear(): any;

}