export interface ICommandHandler {
    handle(): Promise<void>;
}