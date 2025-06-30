import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logDir = 'logs';
  private readonly errorLogFile = path.join(this.logDir, 'error.log');
  private readonly combinedLogFile = path.join(this.logDir, 'combined.log');

  constructor() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir);
    }
  }

  private formatMessage(level: string, message: any, context?: string) {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}] ` : '';
    return `${timestamp} ${level} ${contextStr}${message}`;
  }

  private writeToFile(file: string, message: string) {
    fs.appendFileSync(file, message + '\n');
  }

  log(message: any, context?: string) {
    const formattedMessage = this.formatMessage('LOG', message, context);
    console.log(formattedMessage);
    this.writeToFile(this.combinedLogFile, formattedMessage);
  }

  error(message: any, trace?: string, context?: string) {
    const formattedMessage = this.formatMessage('ERROR', message, context);
    console.error(formattedMessage);
    if (trace) {
      console.error(trace);
      this.writeToFile(this.errorLogFile, formattedMessage + '\n' + trace);
    } else {
      this.writeToFile(this.errorLogFile, formattedMessage);
    }
    this.writeToFile(this.combinedLogFile, formattedMessage);
  }

  warn(message: any, context?: string) {
    const formattedMessage = this.formatMessage('WARN', message, context);
    console.warn(formattedMessage);
    this.writeToFile(this.combinedLogFile, formattedMessage);
  }

  debug?(message: any, context?: string) {
    const formattedMessage = this.formatMessage('DEBUG', message, context);
    console.debug(formattedMessage);
    this.writeToFile(this.combinedLogFile, formattedMessage);
  }

  verbose?(message: any, context?: string) {
    const formattedMessage = this.formatMessage('VERBOSE', message, context);
    console.log(formattedMessage);
    this.writeToFile(this.combinedLogFile, formattedMessage);
  }
}
