/**
 * Created by axetroy on 17-7-14.
 */
const crypto = require('crypto');
import * as _ from 'lodash';
import * as moment from 'moment';
import { FormQuery$ } from './graphql/types/formQuery';

interface Query$ {
  limit: number;
  page: number;
  skip: number;
  sort: string[];
  keyJson: string;
  songo: Object;
}

export function RFC3339NanoFormat(date: Date): string {
  return moment(date).format(`YYYY-MM-DDTHH:mm:ss.SSSZ`);
}

interface PlainObject$ {
  [key: string]: any;
}

export function RFC3339NanoMaper<T extends PlainObject$>(obj: T): T {
  for (let attr in obj) {
    if (obj.hasOwnProperty(attr) && <any>obj[attr] instanceof Date) {
      obj[attr] = RFC3339NanoFormat(obj[attr]);
    }
  }
  return obj;
}

/**
 * 初始化query
 * @param {FormQuery$} query
 * @returns {Query$}
 */
export function initQuery(query: FormQuery$): Query$ {
  let { page, limit, skip, sort, keyJson } = query;
  page = _.isNumber(page) ? page : 0;
  limit = _.isNumber(limit) ? limit : 10;
  skip = _.isNumber(skip) ? skip : 0;
  sort = _.isArray(sort) ? sort : ['-createdAt'];
  keyJson = _.isString(keyJson) && !_.isEmpty(keyJson) ? keyJson : '{}';
  let songo = {};
  try {
    songo = JSON.parse(keyJson);
  } catch (err) {
    throw new Error(`Invalid json input: ${keyJson}`);
  }
  return { page, limit, skip, sort, keyJson, songo };
}

/**
 * 解析sort字段
 * @param {string[]} sort
 * @returns {[(string | string | string)[] , (string | string | string)[] , (string | string | string)[] , (string | string | string)[] , (string | string | string)[]]}
 */
export function sortMap(sort: string[]): (string[])[] {
  return sort.map((s: string) => {
    const sortArray: string[] = s.match(/^([\+\-])(\w+)$/) || [];
    const sortDir: string | null = sortArray[1] || '+';
    const sortField: string | null = sortArray[2];
    // ASC 按升排序
    // DESC 按降排序
    return [sortField, sortDir === '+' ? 'ASC' : 'DESC'];
  });
}

export function interval(func: Function, ms: number) {
  let timer = setTimeout(function repeat() {
    const response = func();
    if (response && _.isFunction(response.then) && _.isFunction(response.catch)) {
      response
        .then(() => {
          timer = setTimeout(repeat, ms);
        })
        .catch(() => {
          timer = setTimeout(repeat, ms);
        });
    } else {
      timer = setTimeout(repeat, ms);
    }
  }, ms);
  return function clear() {
    clearTimeout(timer);
  };
}

/**
 * 沉睡几秒
 * @param {number} ms
 * @returns {Promise<any>}
 */
export async function sleep(ms: number): Promise<any> {
  return new Promise((resolve, reject) => {
    this.__TimeOutNumber__ = setTimeout(() => {
      const timeout = this.__TimeOutNumber__;
      timeout && clearInterval(timeout);
      resolve();
    }, ms);
  });
}

/**
 * md5加密字符串
 * @param {string} str
 * @returns {string}
 */
export function md5(str: string): string {
  return crypto
    .createHash('md5')
    .update(str)
    .digest('hex');
}

/**
 * 获取unix时间戳
 * @param {Date} date
 * @returns {number}
 */
export function getUnixTime(date?: Date): number {
  const d = date ? date : new Date();
  return Math.floor(d.getTime() / 1000);
}
