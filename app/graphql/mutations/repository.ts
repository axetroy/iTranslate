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
import {
  createRepository,
  updateRepository
} from "../../controllers/repository";
import { Repository } from "../types/repository";

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
              name: {
                type: new GraphQLNonNull(GraphQLString),
                description: "仓库名称"
              },
              owner: {
                type: GraphQLID,
                description: "仓库拥有者的UUID"
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
      async resolve(root: any, { argv }: any, req: any) {
        const { name, description, isPrivate, readme } = argv;
        const token = req.token;
        return await createRepository({
          uid: token.uid,
          owner: token.uid,
          name,
          description,
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
        const { id, name, description, isActive, readme } = argv;
        const token = ctx["token"];
        return await updateRepository({
          id,
          uid: token.uid,
          name,
          description,
          isActive,
          readme
        });
      }
    }
  }
};
