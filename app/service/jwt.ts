const jwt = require("jsonwebtoken");
import * as moment from "moment";

import { getUnixTime } from "../utils";

const PRIVATE_KEY = "shhhhh";

interface Token$ {
  uid: string;
  expired: number;
}

/**
 * 加密token
 * @param {string} uid
 * @returns {string}
 */
export function generateToken(uid: string): string {
  return jwt.sign(
    {
      uid,
      expired: getUnixTime(
        moment()
          .add(1, "day")
          .toDate()
      ) // unix time
    },
    PRIVATE_KEY
  );
}

/**
 * 解密token
 * @param {string} token
 * @returns {Promise<string>}
 */
export function decryptToken(token: string): Promise<Token$> {
  token = token || "";
  return new Promise((resolve, reject) => {
    jwt.verify(token, PRIVATE_KEY, function(err, decoded) {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

/**
 * 认证token
 * @param {string} token
 * @returns {Promise<void>}
 */
export async function verifyToken(token: string): Promise<Token$> {
  token = token || "";
  token = (token || "").replace(/^Bearer\s+/, "");
  try {
    const decoded = await decryptToken(token);
    if (getUnixTime() > decoded.expired) {
      throw null;
    }
    return decoded;
  } catch (err) {
    throw new Error(`Invalid token`);
  }
}
