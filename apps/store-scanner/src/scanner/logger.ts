import { LogProvider  } from "@rayvin-flow/flow-scanner-lib/lib/providers/log-provider";
import {Logger} from "logger"

export const logger: LogProvider = () => {
    return {
        debug: (...args) => {
            Logger.debug(args);
        },
        info(...args) {
            Logger.info(args);
        },
        warn(...args) {
            Logger.warn(args);
        },
        error(...args) {
            Logger.error(args);
        },
    }
}