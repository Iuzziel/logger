import { appendFileSync } from "fs";

export class Logger {
  private logFile: string = "undefined.log";
  private debugEnable: boolean = false;
  static _instance: Logger;

  constructor(loggerConfig?: LoggerConfig) {
    if (Logger._instance) {
      throw new Error("Singleton, utiliser Logger.getInstance()");
    }
    if (loggerConfig) {
      if (loggerConfig.debugEnable) {
        this.debugEnable = loggerConfig.debugEnable;
      }
      if (loggerConfig.logFile) {
        this.logFile = loggerConfig.logFile;
      }
    }
  }

  private _log(logType: LogType, message: any): void {
    let logMessage = JSON.stringify(message);
    appendFileSync(
      this.logFile,
      `[${new Date().toLocaleString()}][${logType}] ${logMessage}\r\n`
    );
    if (logType == LogType.INFO || logType == LogType.DEBUG) {
      console.log(logMessage);
    } else if (logType == LogType.ERROR || logType == LogType.FATAL) {
      console.error(logMessage);
    }
  }

  public info(message: any): void {
    this._log(LogType.INFO, message);
  }

  public error(message: any): void {
    this._log(LogType.ERROR, message);
  }

  public fatal(message: any): void {
    this._log(LogType.FATAL, message);
  }

  public debug(message: any): void {
    if (this.debugEnable) {
      this._log(LogType.DEBUG, message);
    }
  }

  public getLogFileName(): string {
    return this.logFile;
  }

  public isDebug(): boolean {
    return this.debugEnable;
  }

  static getInstance(): Logger {
    if (!Logger._instance) {
      Logger._instance = new Logger();
    }
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
}

export default Logger;
