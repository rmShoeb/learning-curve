import { LogLevel } from '../app/core/models/log-level.enum';

export const environment = {
    production: true,
    logLevel: LogLevel.ERROR // Only show errors in production
};
