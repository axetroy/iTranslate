/**
 * Created by axetroy on 17-7-13.
 */
import { GraphQLNonNull, GraphQLString, GraphQLBoolean } from "graphql";
import * as Koa from "koa";
import {
  getUserInfo,
  getUserInfoByUsername,
  searchUser
} from "../../controllers/user";
import { UserListType, UserType, PublicUser } from "../types/user";

export default {
  Public: {
    isUser: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: "判定一个用户名是不是用户",
      args: {
        username: {
          type: new GraphQLNonNull(GraphQLString),
          description: "用户名"
        }
      },
      async resolve(root: any, params: any, ctx: Koa.Context) {
        const username = params.username;
        console.log(`查询用户名`, username);
        try {
          await getUserInfoByUsername(username);
          return true;
        } catch (err) {
          return false;
        }
      }
    },
    user: {
      type: PublicUser,
      description: "获取用户的公开信息",
      args: {
        username: {
          type: new GraphQLNonNull(GraphQLString),
          description: "用户名"
        }
      },
      async resolve(root: any, params: any, ctx: Koa.Context) {
        const username = params.username;
        return await getUserInfoByUsername(username);
      }
    }
  },
  Me: {
    user: {
      type: UserType,
      description: "获取用户/组织信息",
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
