/**
 * Created by axetroy on 17-7-13.
 */
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean
} from "graphql";

import { generateListType } from "./generate-list";
import { getUserInfoFromField } from "./user";

export const RowType = new GraphQLObjectType({
  name: "RowType",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: "唯一标识符"
    },
    creator: getUserInfoFromField("uid"),
    key: {
      type: new GraphQLNonNull(GraphQLString),
      description: "关键字"
    },
    description: {
      type: GraphQLString,
      description: "描述"
    },
    code: {
      type: new GraphQLNonNull(GraphQLInt),
      description: "翻译码"
    },
    value: {
      type: new GraphQLNonNull(GraphQLString),
      description: "翻译信息 JSON 字符串"
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

export const RowListType = generateListType(RowType);
