import { isNullOrUndefined } from 'util';
/**
 * Created by axetroy on 17-7-17.
 */

// 提供错误信息的服务
import * as _ from 'lodash';

interface ErrorPreset {
  [errorCode: number]: string;
}

class ErrorService {
  constructor(private errorPreset: ErrorPreset) {
    this.verify(errorPreset);
  }

  verify(errorPreset: ErrorPreset) {
    let key: any = {};
    let values: any = {};
    for (let code in errorPreset) {
      if (errorPreset.hasOwnProperty(code)) {
        const val = errorPreset[code];
        if (key[code] === true) {
          throw new Error(`Can not redefine the Error Code ${code}`);
        } else if (values[val] === true) {
          throw new Error(`Can not redefine the Error Message ${val}`);
        } else {
          key[code] = true;
          values[val] = true;
        }
      }
    }
    key = null;
  }

  /**
   * 通错错误码，获取消息
   * @param {number} errorCode
   * @returns {string}
   */
  get(errorCode: number): string {
    return this.errorPreset[errorCode] || this.errorPreset[0] || 'Unknown';
  }

  /**
   * 通过邮件或者其他方式上报错误
   * @param err
   */
  reportError(err: Error) {
    // report the error log by email or something else
  }

  /**
   * 记录错误在log里
   * @param err
   * @returns {Promise<void>}
   */
  async recordError(err: Error) {
    // write in the log
  }

  /**
   * 优雅的抛出错误，根据状态码
   * @param errorCode
   * @param msg
   */
  throwError(errorCode?: number, msg?: string): void {
    errorCode = errorCode || 0;
    msg = msg || `An error occurred`;
    const message: string | void = msg || this.errorPreset[errorCode];
    const e: Error = new Error();

    throw new Error(
      JSON.stringify(
        {
          errorCode,
          type: this.errorPreset[errorCode],
          msg: message,
          stack: e.stack
        },
        null,
        2
      )
    );
  }
}

const ERROR_PRESET = {
  // 通用的错误类型
  0: 'Unknown', // 未知错误
  3: 'Duplicate', // 重复
  7: 'User not exist', // 用户不存在
  8: 'Invalid argument', // 无效的参数
  9: 'Invalid user', // 无效的用户
  10: 'Invalid token', // 无效token
  11: 'Invalid UID', // 无效的用户id
  12: 'Permission denied', // 没有权限
  21: 'No data', // 找不到数据
  22: 'Data is inactive', // 数据未激活
  23: 'Invalid field', // 无效字段
  24: 'Create data row fail', // 创建数据失败
  25: 'Secure password is required', // 缺少安全密码
  26: 'Exceeded the maximum limit', // 超出最大限制
  27: 'Exceeded the minimum limit', // 小于最小限制
  28: 'Limit large then 100', // 查询的limit不能超过100
  29: 'Invalid time', // 无效的时间，比如交易/提现/转账等
  30: 'Wallet balance not enough', // 钱包余额不足
  31: 'Invalid config', // 无效的系统配置项
  32: 'Invalid currency', // 无效的货币/钱包
  33: 'Immutable data', // 该数据无法再被更改
  34: 'Under Maintain', // 系统维护中
  // 交易类的错误
  1001: 'Invalid trade type', // 无效的交易类型
  1002: "Trade order's balance not enough", // 撤销交易订单，但是订单的余额已经不足以撤回

  // 转账类的错误
  2001: 'Invalid transfer flow', // 无效的转账/兑换路线

  // 提现类的错误
  3001: 'Invalid withdraw config', // 没有找到提现的相关配置
  3302: 'Invalid withdraw flow', // 无效的提现路线
  3303: 'Invalid withdraw method', // 无效的提现方式
  3304: 'Invalid withdraw type', // 无效的提现类型
  3305: 'Invalid withdraw status', // 无效的提现订单状态
  3306: 'Immutable withdraw status', // 无法再更改该订单的状态

  // 充值类的错误
  4001: 'Invalid exchange', // 无效的汇率
  4002: 'Immutable recharge status', // 无法再更改该订单的状态

  // 系统配置

  // 手续费

  // 预留...
  9999: ''
};

export default new ErrorService(ERROR_PRESET);
