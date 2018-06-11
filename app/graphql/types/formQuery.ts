/**
 * Created by axetroy on 17-7-14.
 */
import {
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLList
} from 'graphql';

/**
 * 用户请求列表的query
 */
export const FormQuery = new GraphQLInputObjectType({
  name: 'FormQuery',
  fields: {
    limit: {
      // limit是必填
      type: new GraphQLNonNull(GraphQLInt),
      description: 'number, 每一页数据的个数',
      defaultValue: 10
    },
    page: {
      type: GraphQLInt,
      description: 'number, 第n页数据',
      defaultValue: 0
    },
    skip: {
      type: GraphQLInt,
      description: 'number, 跳过第n条数据',
      defaultValue: 0
    },
    sort: {
      type: new GraphQLList(GraphQLString),
      description: 'string[] 排序方式，数组字符串',
      defaultValue: ['-createdAt']
    },
    keyJson: {
      type: GraphQLString,
      description: 'string JSON格式的字符串',
      defaultValue: ''
    }
  }
});

export interface FormQuery$ {
  limit: number;
  page?: number;
  skip?: number;
  sort?: string[];
  keyJson?: string;
}

export interface Query$ {
  query: FormQuery$;
}
