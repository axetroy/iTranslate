/**
 * Created by axetroy on 17-7-13.
 */
import * as Koa from "koa";
import { verifyToken } from "../../service/jwt";
import { getUserInfo } from "../../controllers/user";
import { UserType } from "../types/user";

const getUserInfoEntity = {
  type: UserType,
  description: "获取用户信息",
  async resolve(root: any, params: any, ctx: Koa.Context) {
    const token = ctx["token"];
    return await getUserInfo(token.uid);
  }
};

export default {
  Public: {},
  Me: {
    user: getUserInfoEntity
  }
};
