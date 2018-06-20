/**
 * Created by axetroy on 17-7-13.
 */
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean
} from "graphql";

import { generateListType } from "./generate-list";
import { getUserInfoFromField } from "./user";

export const Member = new GraphQLObjectType({
  name: "RepositoryMember",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: "唯一标识符"
    },
    user: getUserInfoFromField("uid"),
    role: {
      type: new GraphQLNonNull(GraphQLString),
      description: "所属角色"
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString)
    },
    updatedAt: {
      type: new GraphQLNonNull(GraphQLString)
    },
    isActive: {
      type: new GraphQLNonNull(GraphQLBoolean)
    }
  }
});

export const Members = generateListType(Member);
