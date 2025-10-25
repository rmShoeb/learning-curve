import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { LogLevel } from '@core/models/log-level.enum';

export { LogLevel };

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private logLevel: LogLevel = environment.logLevel || LogLevel.ERROR;

  /**
   * Log error messages (always shown unless in production with ERROR level disabled)
   */
  error(message: string, ...args: any[]): void {
    if (this.logLevel >= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }

  /**
   * Log warning messages
   */
  warn(message: string, ...args: any[]): void {
    if (this.logLevel >= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  /**
   * Log informational messages
   */
  info(message: string, ...args: any[]): void {
    if (this.logLevel >= LogLevel.INFO) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  /**
   * Log debug messages (only in development)
   */
  debug(message: string, ...args: any[]): void {
    if (this.logLevel >= LogLevel.DEBUG) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }

  /**
   * Export logs as JSON (can be extended to store logs in memory)
   */
  exportLogs(): string {
    // This is a placeholder - you could extend this to collect logs in memory
    // and export them when needed
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      message: 'Log export feature - extend as needed'
    });
  }

  /**
   * Set log level dynamically
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  /**
   * Get current log level
   */
  getLogLevel(): LogLevel {
    return this.logLevel;
  }
}
