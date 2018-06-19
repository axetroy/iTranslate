/**
 * Created by axetroy on 17-7-13.
 */
import * as Koa from "koa";
const fs = require("fs-extra");
const path = require("path");
const _ = require("lodash");

import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";

import { verifyToken } from "../service/jwt";

const queryPath: string = path.join(__dirname, "queries");
const mutationsPath: string = path.join(__dirname, "mutations");

const queryFiles: string[] = fs.readdirSync(queryPath);
const mutationsFiles: string[] = fs.readdirSync(mutationsPath);

// load query and mutation
let query: any = { Public: {}, Me: {} };
let mutation: any = {};

while (queryFiles.length) {
  const file: string = <string>queryFiles.shift();
  const ext = path.extname(file);
  if (ext !== ".js" && ext !== ".ts") {
    continue;
  }
  let m = require(path.join(queryPath, file));
  m = m.default ? m.default : m;
  query = {
    Public: { ...query.Public, ...m.Public },
    Me: { ...query.Me, ...m.Me }
  };
}

while (mutationsFiles.length) {
  const file: string = <string>mutationsFiles.shift();
  const ext = path.extname(file);
  if (ext !== ".js" && ext !== ".ts") {
    continue;
  }
  let m = require(path.join(mutationsPath, file));
  m = m.default ? m.default : m;
  mutation = {
    Public: { ...mutation.Public, ...m.Public },
    Me: { ...mutation.Me, ...m.Me }
  };
}

const args = {
  token: {
    type: GraphQLString
  }
};

/**
 * 扩展req字段
 * @param ctx
 * @param params
 * @returns {Promise<void>}
 */
async function extendContext(ctx: Koa.Context, params: any) {
  const Authorization: string =
    params.token ||
    ctx.headers.authorization ||
    ctx.cookies.get("Authorization") ||
    "";
  const token = (ctx["token"] = await verifyToken(Authorization));
  if (!token || !token.uid) {
    throw new Error(`Invalid token`);
  }
}

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      ["public"]: {
        name: "UserPublic",
        type: new GraphQLObjectType({
          name: "UserPublicQuery",
          fields: query.Public
        }),
        resolve(root: any, params: any, req: any) {
          return query.Public;
        }
      },
      me: {
        name: "UserMe",
        type: new GraphQLObjectType({
          name: "UserMeQuery",
          fields: query.Me
        }),
        args,
        async resolve(root: any, params: any, req: any) {
          await extendContext(req, params);
          return query.Me;
        }
      }
    }
  }),
  mutation: new GraphQLObjectType({
    name: "mutation",
    fields: {
      ["public"]: {
        name: "UserPublic",
        type: new GraphQLObjectType({
          name: "UserPublicMutation",
          fields: mutation.Public
        }),
        args,
        async resolve(root: any, params: any, req: any) {
          return mutation.Public;
        }
      },
      me: {
        name: "UserMe",
        type: new GraphQLObjectType({
          name: "UserMeMutation",
          fields: mutation.Me
        }),
        args,
        async resolve(root: any, params: any, req: any) {
          await await extendContext(req, params);
          return mutation.Me;
        }
      }
    }
  })
});
