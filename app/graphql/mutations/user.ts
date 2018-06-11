/**
 * Created by axetroy on 17-7-14.
 */
import * as Koa from "koa";
import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean
} from "graphql";
import { login, createUser, updateUserInfo } from "../../controllers/user";
import {
  UserType,
  RegisterArgv,
  LoginArgv,
  LoginType,
  UpdateUserArgv
} from "../types/user";

const loginEntity = {
  type: LoginType,
  description: "登陆",
  args: {
    argv: {
      type: LoginArgv
    }
  },
  async resolve(root: any, params: any, ctx: Koa.Context) {
    const { username, password } = params.argv;

    const profile = await login({ username, password });

    // ctx.cookies.set("Authorization", profile.token, {
    //   path: "/",
    //   // Token 有效期为12个小时
    //   expires: new Date(new Date().getTime() + 12 * 3600 * 1000),
    //   httpOnly: true, // 是否只用于http请求中获取
    //   overwrite: true // 是否允许重写
    // });

    return profile;
  }
};

const registryEntity = {
  type: LoginType,
  description: "注册",
  args: {
    argv: {
      type: RegisterArgv
    }
  },
  async resolve(root: any, { argv }: any, req: any) {
    const { username, password } = argv;
    return await createUser({ username, password });
  }
};

const updateEntity = {
  type: UserType,
  description: "更新用户资料",
  args: {
    argv: {
      type: UpdateUserArgv
    }
  },
  async resolve(root: any, { argv }: any, ctx: Koa.Context) {
    const token = ctx["token"];
    const { nickname } = argv;
    return await updateUserInfo({ uid: token.uid, nickname });
  }
};

export default {
  Public: {
    registry: registryEntity,
    login: loginEntity
  },
  Me: {
    updateProfile: updateEntity,
    logout: {
      type: GraphQLBoolean,
      description: "用户登出",
      async resolve(root: any, params: any, ctx: Koa.Context) {
        return true;
      }
    }
  }
};
