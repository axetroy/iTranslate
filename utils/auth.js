const CookieParse = require("cookie").parse;
const ClientCookie = require("js-cookie");

const TOKEN_FIELD = "Authorization";
const PREFIX = /^Bearer\s+/;

export function clientGet() {
  return (ClientCookie.get(TOKEN_FIELD) || "").replace(PREFIX, "");
}

export function clientSet(token) {
  // 写进Cookie，为了首屏渲染的身份验证
  return ClientCookie.set(TOKEN_FIELD, token, { expires: 1 });
}

export function serverGet(req) {
  if (!req) {
    console.warn(`Get Token Must With The Request.`);
    return "";
  }
  let token = req.headers[TOKEN_FIELD.toUpperCase()];
  // 先从Header读取
  if (token) {
    return token.replace(PREFIX, "");
  }

  // 再从Cookie读取
  if (!req.headers.cookie) return "";

  token = (CookieParse(req.headers.cookie) || {})[TOKEN_FIELD];

  if (!token) return "";

  return token.replace(PREFIX, "");
}

export function serverSet(token, req, res) {
  // 如果是服务端的话
  // 写入客户端的cookie
  // TODO
}

/**
 * 获取 token
 * @param {*} req
 */
function get(req) {
  return process.server ? serverGet(req) : clientGet();
}

/**
 * 设置token
 * @param {*} token
 * @param {*} res
 */
function set(token, res) {
  return process.server ? serverSet() : clientSet(token);
}

export default {
  get,
  set,
  TOKEN_FIELD,
  clientGet,
  clientSet,
  serverGet,
  serverSet
};
