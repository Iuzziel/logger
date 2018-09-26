import { appendFileSync } from "fs";

export class Logger {
  private logFile;
  private isDebug;

  constructor(isDebug: boolean = false, logFile: string = "undefined.log") {
    this.logFile = logFile;
    this.isDebug = isDebug;
  }

  private _log(logType: LogType, message: any) {
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

  public info(message: any) {
    this._log(LogType.INFO, message);
  }

  public error(message: any) {
    this._log(LogType.ERROR, message);
  }

  public fatal(message: any) {
    this._log(LogType.FATAL, message);
  }

  public debug(message: any) {
    if (this.isDebug) {
      this._log(LogType.DEBUG, message);
    }
  }
}

enum LogType {
  INFO = "INFO",
  ERROR = "ERROR",
  FATAL = "FATAL",
  DEBUG = "DEBUG"
}
export default Logger;
