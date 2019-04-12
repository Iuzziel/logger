import * as fs from "fs";

export class Logger {
    private logFile: string = "undefined.log";
    private logCategory: string[] = new Array<string>();
    private debugEnable: boolean = false;
    static _instance: Logger;

    constructor(loggerConfig?: LoggerConfig) {
        if (Logger._instance) throw new Error("Singleton, utiliser Logger.getInstance()");

        if (loggerConfig) {
            if (loggerConfig.debugEnable) this.debugEnable = loggerConfig.debugEnable;
            if (loggerConfig.logFile) this.logFile = loggerConfig.logFile;
            if (loggerConfig.logCategory) this.logCategory = loggerConfig.logCategory;
        }
    }

    private _log(logType: LogType, message: any, logCategory?: string): Promise<void> {
        if (logCategory && this.logCategory
            && Array.isArray(this.logCategory) && this.logCategory.length > 0
            && this.logCategory.findIndex((v, i, a) => v === logCategory) !== -1)
            return fs.promises.appendFile(this.logFile, `[${new Date().toLocaleString()}][${logType}][${logCategory}] ${JSON.stringify(message)}\r\n`)
                .catch(err => console.error(err));
        else
            return fs.promises.appendFile(this.logFile, `[${new Date().toLocaleString()}][${logType}] ${JSON.stringify(message)}\r\n`)
                .catch(err => console.error(err));
    }

    public info(message: any, logCategory?: string): Promise<void> {
        return this._log(LogType.INFO, message, logCategory);
    }

    public error(message: any, logCategory?: string): Promise<void> {
        return this._log(LogType.ERROR, message, logCategory);
    }

    public fatal(message: any, logCategory?: string): Promise<void> {
        return this._log(LogType.FATAL, message, logCategory);
    }

    public debug(message: any, logCategory?: string): Promise<void> {
        if (this.debugEnable)
            return this._log(LogType.DEBUG, message, logCategory);
    }

    public getLogFileName(): string {
        return this.logFile;
    }

    public isDebug(): boolean {
        return this.debugEnable;
    }

    static getInstance(): Logger {
        if (!Logger._instance) Logger._instance = new Logger();
        return Logger._instance;
    }
}

enum LogType {
    INFO = "INFO",
    ERROR = "ERROR",
    FATAL = "FATAL",
    DEBUG = "DEBUG"
}

export interface LoggerConfig {
    debugEnable?: boolean;
    logFile?: string;
    logCategory?: string[];
}

export default Logger;
