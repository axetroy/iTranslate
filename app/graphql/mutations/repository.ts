/**
 * Created by axetroy on 17-7-14.
 */

import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID
} from "graphql";
import * as Koa from "koa";
import { Repository } from "../types/repository";
import { Member } from "../types/member";

import {
  createRepository,
  updateRepository,
  AddCollaborator
} from "../../controllers/repository";

export default {
  Public: {},
  Me: {
    createRepository: {
      type: Repository,
      description: "创建新仓库",
      args: {
        argv: {
          type: new GraphQLInputObjectType({
            name: "CreateRepositoryArgv",
            fields: {
              owner: {
                type: GraphQLID,
                description:
                  "仓库拥有者的UUID, 如果是创建组织的项目，则需要指定owner"
              },
              name: {
                type: new GraphQLNonNull(GraphQLString),
                description: "仓库名称"
              },
              languages: {
                type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
                description: "该仓库所支持的语言"
              },
              description: {
                type: new GraphQLNonNull(GraphQLString),
                description: "仓库描述"
              },
              isPrivate: {
                type: GraphQLBoolean,
                defaultValue: false,
                description: "仓库是否私有"
              },
              readme: {
                type: GraphQLString,
                description: "仓库的README"
              }
            }
          })
        }
      },
      async resolve(root: any, { argv }: any, ctx: Koa.Context) {
        const { name, owner, description, languages, isPrivate, readme } = argv;
        const token = ctx["token"];
        return await createRepository({
          uid: token.uid,
          owner: owner || token.uid,
          name,
          description,
          languages,
          isPrivate,
          readme
        });
      }
    },
    updateRepository: {
      type: Repository,
      description: "更新仓库信息",
      args: {
        argv: {
          type: new GraphQLInputObjectType({
            name: "UpdateRepositoryArgv",
            fields: {
              id: {
                type: new GraphQLNonNull(GraphQLString),
                description: "仓库ID"
              },
              name: {
                type: GraphQLString,
                description: "仓库名称"
              },
              languages: {
                type: new GraphQLList(GraphQLString),
                description: "该仓库所支持的语言"
              },
              description: {
                type: GraphQLString,
                description: "仓库描述"
              },
              readme: {
                type: GraphQLString,
                description: "仓库README"
              },
              isActive: {
                type: GraphQLBoolean
              }
            }
          })
        }
      },
      async resolve(root: any, { argv }: any, ctx: Koa.Context) {
        const { id, name, description, languages, isActive, readme } = argv;
        const token = ctx["token"];
        return await updateRepository({
          id,
          uid: token.uid,
          name,
          description,
          languages,
          isActive,
          readme
        });
      }
    },
    addCollaborator: {
      type: Member,
      description: "添加项目成员",
      args: {
        username: {
          type: new GraphQLNonNull(GraphQLString),
          description: "用户名"
        },
        repoId: {
          type: new GraphQLNonNull(GraphQLString),
          description: "仓库ID"
        }
      },
      async resolve(root: any, params: any, ctx: Koa.Context) {
        const username: string = params.username;
        const repoId: string = params.repoId;
        const token = ctx["token"];
        console.log(token);
        console.log(username);
        console.log(repoId);
        return AddCollaborator({
          uid: token.uid,
          username,
          repoId
        });
      }
    }
  }
};
