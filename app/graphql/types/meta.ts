/**
 * Created by axetroy on 17-7-14.
 */

import {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql';

export const count = {
  type: GraphQLInt
};

export const limit = {
  type: GraphQLInt
};

export const page = {
  type: GraphQLInt
};

export const skip = {
  type: GraphQLInt
};

export const num = {
  type: GraphQLInt
};

export const sort = {
  type: new GraphQLList(GraphQLString)
};

export const keyJson = {
  type: GraphQLString
};

/**
 * 返回的meta信息
 */
export default new GraphQLObjectType({
  name: 'meta',
  fields: {
    count,
    limit,
    page,
    skip,
    num,
    sort,
    keyJson
  }
});
