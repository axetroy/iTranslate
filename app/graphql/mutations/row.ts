/**
 * Created by axetroy on 17-7-14.
 */

import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { createRow, updateRow } from '../../controllers/row';
import { RowType } from '../types/row';

const createRowEntity = {
  type: RowType,
  description: '创建row',
  args: {
    argv: {
      type: new GraphQLInputObjectType({
        name: 'CreateRowArgv',
        fields: {
          id: {
            type: GraphQLString
          },
          tid: {
            type: new GraphQLNonNull(GraphQLString)
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
          }
        }
      })
    }
  },
  async resolve(root: any, { argv }: any, req: any) {
    const { key, tid, value_en, value_cn, value_tw } = argv;
    const token = req.token;
    return await createRow({
      tid,
      uid: token.uid,
      key,
      value_en,
      value_cn,
      value_tw
    });
  }
};

const updateRowEntity = {
  type: RowType,
  description: '更新row',
  args: {
    argv: {
      type: new GraphQLInputObjectType({
        name: 'UpdateRowArgv',
        fields: {
          id: {
            type: new GraphQLNonNull(GraphQLString)
          },
          tid: {
            type: GraphQLString
          },
          key: {
            type: GraphQLString
          },
          value_en: {
            type: GraphQLString
          },
          value_cn: {
            type: GraphQLString
          },
          value_tw: {
            type: GraphQLString
          }
        }
      })
    }
  },
  async resolve(root: any, { argv }: any, req: any) {
    const { id, key, value_en, value_cn, value_tw } = argv;
    const token = req.token;
    return await updateRow({
      id,
      uid: token.uid,
      key,
      value_en,
      value_cn,
      value_tw
    });
  }
};

export default {
  Public: {},
  Me: {
    createRow: createRowEntity,
    updateRow: updateRowEntity
  }
};
