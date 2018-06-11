import * as path from 'path';
import * as winston from 'winston';
import * as moment from 'moment';
import * as util from 'util';

const cwd = process.cwd();
const pkg = require('../../package.json');
const LOGS_DIR = path.join(cwd, 'logs');

const TRADE_LOG = 'trade';
const TRADE_STAT_LOG = 'trade-stat';
const TRANSFER_LOG = 'transfer';
const WITHDRAW_LOG = 'withdraw';
const SPENDING_LOG = 'spending';
const RECHARGE_LOG = 'recharge';

function timestamp(date: Date = new Date()): string {
  return moment(date).format('YYYY-MM-DD HH:mm:ss.SSSS');
}

function formatter(params: any): string {
  // Options object will be passed to the format function.
  // It's general properties are: timestamp, level, message, meta.
  const meta = params.meta !== undefined ? util.inspect(params.meta, { depth: null }) : '';
  return `[${timestamp(
    params.timestamp
  )}] [${params.level}] [${pkg.name}] *** ${params.message} ${meta}`;
}

/**
 * 生成日志实例
 * @param {string} logName
 * @returns {winston.LoggerInstance}
 */
function generateLog(logName: string): any {
  return winston.loggers.add(logName, {
    console: {
      level: 'silly',
      colorize: true,
      label: `${logName.toUpperCase()}`
    },
    transports: [
      new winston.transports.File({
        timestamp,
        filename: logName + '.log',
        dirname: LOGS_DIR,
        maxsize: '100M'
      })
    ]
  });
}

generateLog(TRADE_LOG);
generateLog(TRADE_STAT_LOG);
generateLog(TRANSFER_LOG);
generateLog(WITHDRAW_LOG);
generateLog(SPENDING_LOG);
generateLog(RECHARGE_LOG);

// 通过这种方式获取日志
export const tradeLogger = winston.loggers.get(TRADE_LOG);
export const tradeStatLogger = winston.loggers.get(TRADE_STAT_LOG);
export const transferLogger = winston.loggers.get(TRANSFER_LOG);
export const withdrawLogger = winston.loggers.get(WITHDRAW_LOG);
export const spendingLogger = winston.loggers.get(SPENDING_LOG);
export const rechargeLogger = winston.loggers.get(RECHARGE_LOG);
