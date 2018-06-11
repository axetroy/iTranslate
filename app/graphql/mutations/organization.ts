/**
 * Created by axetroy on 17-7-14.
 */

import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString
} from "graphql";
import * as Koa from "koa";
import {
  createOrganization,
  updateOrganization
} from "../../controllers/organization";
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
    }
  }
};
