export default function(dataList: any[], tableName) {
  const entity = {};
  dataList.forEach(d => {
    entity[d.key] = {
      en: d.value_en,
      cn: d.value_cn,
      tw: d.value_tw
    };
  });

  const keys = {};

  return `/* generate by i18n error platform, please do not edit it */
module.exports = class I18nError extends Error {
  constructor(Code, Detail, Prefix) {
    super(Detail);
    this.Code = Code;
    this.Detail = Detail;
    this.Prefix = Prefix;
    this.vars = null;
    this.context = null;
  }
  GetCode() {
    return this.Code;
  }
  GetDetail() {
    return this.Detail;
  }
  SetDetail(detail) {
    this.Detail = detail;
    return this;
  }
  GetPrefix() {
    return this.Prefix;
  }
  GetVars(){
    return this.vars;
  }
  SetVars(vars) {
    this.vars = vars;
    return this;
  }
  GetContext(){
    return this.context;
  }
  SetContext(context){
    this.context = context;
    return this;
  }
  Error() {
    return this.toString();
  }
  toString() {
    return this.Prefix + this.Code + '|' + this.Detail;
  }
};
  
${dataList
    .sort(v => -v.key)
    .map(d => {
      if (!keys[d.key]) {
        keys[d.key] = keys[d.key] ? keys[d.key] + 1 : 1;
        return `module.exports.${d.key} = new I18nError(${d.code}, "${
          d.value_en
        }", "${d.tableName || tableName}"); // ${d.value_cn}`;
      } else {
        // 重复的key，按照顺序排列
        return `module.exports.${d.key}_${keys[d.key]} = new I18nError(${d.code}, "${
          d.value_en
        }", "${d.tableName || tableName}"); // ${d.value_cn}`;
      }
    })
    .join("\n")}

/**
 * i18nCatch
 * @param {Promise<any>} promise
 * @returns {Promise<I18nError>}
 */
export function i18nCatch(promise) {
  return promise.catch(err => {
    return Promise.reject(fromError(err));
  });
}

/**
 * cover promise err to I18n err
 * @param promise
 * @param {{}} context
 */
export function i18nErrify(promise, context) {
  return i18nCatch(promise).catch(err => Promise.reject(err.SetContext(context)));
}


/**
 * cover error to I18nError
 * @param err
 * @returns {I18nError}
 */
export function fromError(err) {
  if (err instanceof Error === false) {
    err = new Error(err + '');
  }
  return new I18nError(err.code || 0, err.detail || err.message, err.prefix || '');
}
`;
}
