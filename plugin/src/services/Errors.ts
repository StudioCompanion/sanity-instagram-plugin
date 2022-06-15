export enum ErrorLevels {
  Warn = 'warn',
  Error = 'error',
  Log = 'log',
}

export class ErrorLog {
  static prefix = 'Sanity-Instagram-Plugin: '
  constructor(msg: string, level = ErrorLevels.Log) {
    // eslint-disable-next-line no-console
    console[level](`${ErrorLog.prefix}${msg}`)
  }

  static message = (string: string) => `${ErrorLog.prefix}${string}`
}
