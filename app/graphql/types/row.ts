/**
 * Created by axetroy on 17-7-13.
 */
import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLInt } from "graphql";

import { generateListType } from "./generate-list";
import { user } from "./user";

export const RowType = new GraphQLObjectType({
  name: "RowType",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString)
    },
    uid: {
      type: new GraphQLNonNull(GraphQLString)
    },
    owner: user,
    tid: {
      type: new GraphQLNonNull(GraphQLString),
      description: "table id"
    },
    code: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    key: {
      type: new GraphQLNonNull(GraphQLString)
    },
    value_en: {
      type: new GraphQLNonNull(GraphQLString)
    },
    value_cn: {
      type: new GraphQLNonNull(GraphQLString)
    },
    value_tw: {
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

export const RowListType = generateListType(RowType);
