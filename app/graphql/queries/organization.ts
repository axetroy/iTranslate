/**
 * Created by axetroy on 17-7-13.
 */
import * as Koa from "koa";
import { GraphQLBoolean, GraphQLNonNull, GraphQLString } from "graphql";
import {
  getOrganization,
  getOrganizations
} from "../../controllers/organization";
import { Organization, Organizations } from "../types/organization";
import { FormQuery } from "../types/formQuery";

export default {
  Public: {},
  Me: {
    organization: {
      type: Organization,
      description: "获取组织信息",
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      async resolve(root: any, params: any, ctx: Koa.Context) {
        const token = ctx["token"];
        return await getOrganization(token.uid, params.id);
      }
    },
    organizations: {
      type: Organizations,
      description: "获取组织列表",
      args: {
        query: {
          name: "query",
          type: new GraphQLNonNull(FormQuery)
        }
      },
      async resolve(root: any, params: any, ctx: Koa.Context) {
        const token = ctx["token"];
        return await getOrganizations(token.uid, params.query);
      }
    }
  }
};
