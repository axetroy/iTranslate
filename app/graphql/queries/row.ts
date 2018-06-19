/**
 * Created by axetroy on 17-7-13.
 */
import { GraphQLNonNull, GraphQLString } from "graphql";
import { getRow, getRowList } from "../../controllers/item";
import { RowType, RowListType } from "../types/item";

export default {
  Public: {},
  Me: {
    row: {
      type: RowType,
      description: "获取仓库的条目",
      args: {
        rid: {
          type: new GraphQLNonNull(GraphQLString),
          description: "仓库ID"
        },
        key: {
          type: new GraphQLNonNull(GraphQLString),
          description: "关键字key"
        }
      },
      async resolve(root: any, params: any, req: any) {
        const key: string = params.key;
        const rid: string = params.rid;
        const token = req.token;
        return await getRow(token.uid, rid, key);
      }
    },
    rows: {
      type: RowListType,
      description: "获取表列表",
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      async resolve(root: any, params: any, req: any) {
        const id = params.id;
        return await getRowList({
          limit: 100,
          // 指定获取某项目ID下的列表
          keyJson: JSON.stringify({ rid: id })
        });
      }
    }
  }
};
