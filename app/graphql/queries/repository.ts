/**
 * Created by axetroy on 17-7-13.
 */
import { GraphQLNonNull, GraphQLString } from "graphql";
import * as Koa from "koa";
import { getCollaboratorsByRepoName } from "../../controllers/collaborator";
import {
  getRepositories,
  getRepository,
  getRepositoryByUid
} from "../../controllers/repository";
import { FormQuery } from "../types/formQuery";
import { Members } from "../types/member";
import { Repositories, Repository } from "../types/repository";

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
        return await getRepository(owner, name, { isPrivate: false });
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
    },
    collaborators: {
      type: Members,
      description: "获取项目的成员",
      args: {
        owner: {
          type: new GraphQLNonNull(GraphQLString),
          description: "仓库所有者"
        },
        name: {
          type: new GraphQLNonNull(GraphQLString),
          description: "仓库名称"
        },
        query: {
          name: "query",
          type: new GraphQLNonNull(FormQuery)
        }
      },
      async resolve(root: any, params: any, ctx: Koa.Context) {
        const { owner, name, query } = params;
        return await getCollaboratorsByRepoName(owner, name, query);
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
    },
    repositories: {
      type: Repositories,
      description: "获取我的仓库列表",
      args: {
        query: {
          name: "query",
          type: new GraphQLNonNull(FormQuery)
        }
      },
      async resolve(root: any, params: any, ctx: Koa.Context) {
        const token = ctx["token"];
        const uid = token.uid;
        return await getRepositories(params.query, { owner: uid });
      }
    }
  }
};
