import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import { getPublicOrganizationById } from "../../controllers/organization";

import { generateListType } from "./generate-list";

export function getOrgInfoFromField(field = "uid", nonnull = true) {
  return {
    type: Organization,
    async resolve(parent: any, params: any, req: any) {
      const id: string = parent[field];
      try {
        return await getPublicOrganizationById(id);
      } catch (err) {
        if (nonnull) {
          throw err;
        } else {
          return null;
        }
      }
    }
  };
}

export const Organization = new GraphQLObjectType({
  name: "Organization",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    description: {
      type: new GraphQLNonNull(GraphQLString)
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString)
    },
    updatedAt: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }
});

export const PublicOrganization = new GraphQLObjectType({
  name: "PublicOrganization",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    description: {
      type: new GraphQLNonNull(GraphQLString)
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString)
    },
    updatedAt: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }
});

export const Organizations = generateListType(Organization);
export const PublicOrganizations = generateListType(PublicOrganization);
