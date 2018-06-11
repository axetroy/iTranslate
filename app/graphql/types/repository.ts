/**
 * Created by axetroy on 17-7-13.
 */
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
  GraphQLList,
  GraphQLInt,
  GraphQLInputObjectType
} from "graphql";

import { generateListType } from "./generate-list";
import { user } from "./user";

export const Repository = new GraphQLObjectType({
  name: "Repository",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString)
    },
    creator: user,
    owner: user,
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    readme: {
      type: GraphQLString
    },
    isPrivate: {
      type: new GraphQLNonNull(GraphQLBoolean)
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

export const Repositories = generateListType(Repository);
