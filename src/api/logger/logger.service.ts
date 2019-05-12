import { LoggerService } from '@nestjs/common';

/**
 * util.format() #
 * %s - String.
 * %d - Number (both integer and float).
 * %j - JSON.
 * %% - single percent sign ('%'). This does not consume an argument.
 *
 * Reset = "\x1b[0m"
 * Bright = "\x1b[1m"
 * Dim = "\x1b[2m"
 * Underscore = "\x1b[4m"
 * Blink = "\x1b[5m"
 * Reverse = "\x1b[7m"
 * Hidden = "\x1b[8m"
 * FgBlack = "\x1b[30m"
 * FgRed = "\x1b[31m"
 * FgGreen = "\x1b[32m"
 * FgYellow = "\x1b[33m"
 * FgBlue = "\x1b[34m"
 * FgMagenta = "\x1b[35m"
 * FgCyan = "\x1b[36m"
 * FgWhite = "\x1b[37m"
 * BgBlack = "\x1b[40m"
 * BgRed = "\x1b[41m"
 * BgGreen = "\x1b[42m"
 * BgYellow = "\x1b[43m"
 * BgBlue = "\x1b[44m"
 * BgMagenta = "\x1b[45m"
 * BgCyan = "\x1b[46m"
 * BgWhite = "\x1b[47m"
 */

export class MyLogger implements LoggerService {
    private instance: string;

    constructor(instanceName?: string) {
        this.instance = instanceName || 'LOGGER';
    }

    log(message: string, trace: string, ...args: any) {
        console.log('[\x1b[36m%s\x1b[0m][%s][%s] \t - Message: %s', 'LOG', trace, new Date().toLocaleTimeString(), message);
    }
    error(trace: string, ...message: any) {
        console.error('[\x1b[31m%s\x1b[0m][\x1b[31m%s\x1b[0m][%s] \n', 'ERROR', trace, new Date().toLocaleTimeString(), JSON.stringify(message, null, 2));
    }
    warn(trace: string, ...message: any) {
        console.warn('[\x1b[31m%s\x1b[0m][%s][%s] \t - Message: %s', 'WARN', trace, new Date().toLocaleTimeString(), JSON.stringify(message, null, 2));
    }
    debug(trace: string, ...message: any) {
        console.log('[\x1b[34m%s\x1b[0m][\x1b[34m%s\x1b[0m][\x1b[34m%s\x1b[0m] \n', 'DEBUG', trace, new Date().toLocaleTimeString(), JSON.stringify(message, null, 2));
    }
    verbose(trace: string, ...message: any) {
        console.log('[\x1b[36m%s\x1b[0m][%s][%s] \t - Message: %s', 'VERBOSE', trace, new Date().toLocaleTimeString(), JSON.stringify(message, null, 2));
    }
}
