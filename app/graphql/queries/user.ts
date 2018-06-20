/**
 * Created by axetroy on 17-7-13.
 */
import * as Koa from "koa";
import { getUserInfo, searchUser } from "../../controllers/user";
import { UserType, UserListType } from "../types/user";
import { GraphQLNonNull, GraphQLString } from "graphql";

export default {
  Public: {},
  Me: {
    user: {
      type: UserType,
      description: "获取用户信息",
      async resolve(root: any, params: any, ctx: Koa.Context) {
        const token = ctx["token"];
        return await getUserInfo(token.uid);
      }
    },
    searchUser: {
      type: UserListType,
      description: "搜索用户",
      args: {
        username: {
          type: new GraphQLNonNull(GraphQLString),
          description: "要搜索的用户名"
        }
      },
      async resolve(root: any, params: any, ctx: Koa.Context) {
        const username = params.username;
        return searchUser(username);
      }
    }
  }
};
