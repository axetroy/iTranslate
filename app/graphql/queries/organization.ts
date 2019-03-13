/**
 * Created by axetroy on 17-7-13.
 */
import * as Koa from "koa";
import { GraphQLBoolean, GraphQLNonNull, GraphQLString } from "graphql";
import {
  getOrganization,
  getPublicOrganization,
  getOrganizations,
  getOperableOrganizations,
  getPublicOrganizationMembers
} from "../../controllers/organization";
import {
  Organization,
  PublicOrganization,
  Organizations
} from "../types/organization";
import { Members } from "../types/member";
import { FormQuery } from "../types/formQuery";

export default {
  Public: {
    isOrganization: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: "判断是有存在组织",
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      async resolve(root: any, params: any, ctx: Koa.Context) {
        // 获取组织
        return true;
      }
    },
    organizationMembers: {
      type: Members,
      description: "获取组织公开的成员列表",
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString)
        },
        query: {
          name: "query",
          type: new GraphQLNonNull(FormQuery)
        }
      },
      async resolve(root: any, params: any, ctx: Koa.Context) {
        const orgName = params.name;
        return getPublicOrganizationMembers(orgName, params.query);
      }
    },
    organization: {
      type: PublicOrganization,
      description: "获取组织公开的信息",
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      async resolve(root: any, params: any, ctx: Koa.Context) {
        return await getPublicOrganization(params.name);
      }
    }
  },
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
    },
    operableOrganizations: {
      type: Organizations,
      description: "获取该用户有权限操作的组织列表",
      async resolve(root: any, params: any, ctx: Koa.Context) {
        const token = ctx["token"];
        return await getOperableOrganizations(token.uid);
      }
    }
  }
};
