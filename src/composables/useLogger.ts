import pc from 'picocolors';
import { ref } from 'vue';

/*
for future settings object: {
  maxLevel: LogLevels
}
*/
enum LogLevels {
  TRACE,
  DEBUG,
  INFO,
  WARN,
  ERROR,
  CRITICAL,
}

export const useLogger = (pre: string) => {
  const pad = ref(15);

  const generateLog = (msg: string, level?: LogLevels) => {
    if (process.env.SERVER) {
      switch (level) {
        case LogLevels.TRACE:
          return console.trace(pc.white(`[${pre}]`.padEnd(pad.value)) + msg);
        case LogLevels.DEBUG:
          return console.debug(pc.cyan(`[${pre}]`.padEnd(pad.value)) + msg);
        case LogLevels.INFO:
          return console.info(pc.blue(`[${pre}]`.padEnd(pad.value)) + msg);
        case LogLevels.WARN:
          return console.warn(pc.yellow(`[${pre}]`.padEnd(pad.value)) + msg);
        case LogLevels.ERROR:
          return console.error(pc.red(`[${pre}]`.padEnd(pad.value)) + msg);
        case LogLevels.CRITICAL:
          return console.log(pc.bgMagenta(`[${pre}]`.padEnd(pad.value)) + msg);
        default:
          return console.log(pc.white(`[${pre}]`.padEnd(pad.value)) + msg);
      }
    }

    if (process.env.CLIENT) {
      const preFormatString = `%c[${pre}]%c`.padEnd(pad.value);
      switch (level) {
        case LogLevels.TRACE:
          return console.trace(
            preFormatString + msg,
            'color: white',
            'color: inherit'
          );
        case LogLevels.DEBUG:
          return console.debug(
            preFormatString + msg,
            'color: cyan',
            'color: inherit'
          );
        case LogLevels.INFO:
          return console.info(
            preFormatString + msg,
            'color: blue',
            'color: inherit'
          );
        case LogLevels.WARN:
          return console.warn(
            preFormatString + msg,
            'color: yellow',
            'color: inherit'
          );
        case LogLevels.ERROR:
          return console.error(
            preFormatString + msg,
            'color: red',
            'color: inherit'
          );
        case LogLevels.CRITICAL:
          return console.log(
            preFormatString + msg,
            'background-color: magenta',
            'background-color: inherit'
          );
        default:
          return console.log(
            preFormatString + msg,
            'color: inherit',
            'color: inherit'
          );
      }
    }

    return console.log(pre, msg);
  };

  generateLog('logger initialized', LogLevels.CRITICAL);

  return {
    pad,
    trace: (msg: string) => generateLog(msg, LogLevels.TRACE),
    debug: (msg: string) => generateLog(msg, LogLevels.DEBUG),
    info: (msg: string) => generateLog(msg, LogLevels.INFO),
    warn: (msg: string) => generateLog(msg, LogLevels.WARN),
    err: (msg: string) => generateLog(msg, LogLevels.ERROR),
    crit: (msg: string) => generateLog(msg, LogLevels.CRITICAL),
    throw: (msg: string) => {
      throw Error(msg as string);
    },
  };
};
