/**
 * Created by axetroy on 17-7-13.
 */
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList
} from "graphql";

import { generateListType } from "./generate-list";
import { getUserInfoFromField } from "./user";

export const Repository = new GraphQLObjectType({
  name: "Repository",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString)
    },
    creator: getUserInfoFromField("creator"),
    owner: getUserInfoFromField("owner"),
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    languages: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
      description: "该仓库所支持的语言"
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
