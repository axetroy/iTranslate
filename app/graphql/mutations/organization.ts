/**
 * Created by axetroy on 17-7-14.
 */

import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import * as Koa from "koa";
import {
  createOrganization,
  updateOrganization,
  inviteMember
} from "../../controllers/organization";
import { Member } from "../types/member";
import { Organization } from "../types/organization";

export default {
  Public: {},
  Me: {
    createOrganization: {
      type: Organization,
      description: "创建新组织",
      args: {
        argv: {
          type: new GraphQLInputObjectType({
            name: "CreateOrganizationArgv",
            fields: {
              name: {
                type: new GraphQLNonNull(GraphQLString),
                description: "组织名称"
              },
              description: {
                type: new GraphQLNonNull(GraphQLString),
                description: "组织描述"
              }
            }
          })
        }
      },
      async resolve(root: any, { argv }: any, ctx: Koa.Context) {
        const { name, description } = argv;
        const token = ctx["token"];
        return await createOrganization({
          uid: token.uid,
          name,
          description
        });
      }
    },
    updateOrganization: {
      type: Organization,
      description: "更新组织信息",
      args: {
        argv: {
          type: new GraphQLInputObjectType({
            name: "UpdateOrganizationArgv",
            fields: {
              id: {
                type: new GraphQLNonNull(GraphQLString),
                description: "组织ID"
              },
              name: {
                type: GraphQLString,
                description: "组织名称"
              },
              description: {
                type: GraphQLString,
                description: "组织描述"
              }
            }
          })
        }
      },
      async resolve(root: any, { argv }: any, ctx: Koa.Context) {
        const { id, name, description, isActive, readme } = argv;
        const token = ctx["token"];
        return await updateOrganization({
          uid: token.uid,
          name,
          description
        });
      }
    },
    addMember: {
      type: Member,
      description: "添加组织成员",
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString),
          description: "组织名称"
        },
        username: {
          type: new GraphQLNonNull(GraphQLString),
          description: "用户名"
        }
      },
      resolve(root: any, { name, username }: any, ctx: Koa.Context) {
        const token = ctx["token"];
        const uid = token.uid;
        return inviteMember(uid, name, username);
      }
    }
  }
};
