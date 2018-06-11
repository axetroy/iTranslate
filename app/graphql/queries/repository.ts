/**
 * Created by axetroy on 17-7-13.
 */
import * as Koa from "koa";
import { GraphQLBoolean, GraphQLNonNull, GraphQLString } from "graphql";
import {
  getRepository,
  getRepositoryByUid,
  getRepositories
} from "../../controllers/repository";
import { Repository, Repositories } from "../types/repository";
import { FormQuery } from "../types/formQuery";

export default {
  Public: {
    repository: {
      type: Repository,
      description: "获取仓库信息",
      args: {
        owner: {
          type: new GraphQLNonNull(GraphQLString)
        },
        name: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      async resolve(root: any, params: any, req: any) {
        const { owner, name } = params;
        return await getRepository(owner, name);
      }
    },
    repositories: {
      type: Repositories,
      description: "获取仓库列表",
      args: {
        query: {
          name: "query",
          type: new GraphQLNonNull(FormQuery)
        }
      },
      async resolve(root: any, params: any, req: any) {
        return await getRepositories(params.query);
      }
    }
  },
  Me: {
    repository: {
      type: Repository,
      description: "获取仓库信息",
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      async resolve(root: any, params: any, ctx: Koa.Context) {
        const { name } = params;
        const token = ctx["token"];
        const uid = token.uid;
        return await getRepositoryByUid(uid, name);
      }
    }
  }
};
