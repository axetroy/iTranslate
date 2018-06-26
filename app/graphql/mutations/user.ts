/**
 * Created by axetroy on 17-7-14.
 */
import { GraphQLBoolean } from "graphql";
import * as Koa from "koa";
import { createUser, login, updateUserInfo } from "../../controllers/user";
import {
  LoginArgv,
  LoginType,
  RegisterArgv,
  UpdateUserArgv,
  UserType
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
    const { username, password,email } = argv;
    return await createUser({ username, password,email });
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
