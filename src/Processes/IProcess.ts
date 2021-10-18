export interface IProcess {
    /**
     * don't call it ( unless in ProcessManager )
     */
    start(): void;

    /**
     * don't call it ( unless in ProcessManager )
     */
    clear(): void;

}