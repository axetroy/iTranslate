/**
 * Created by axetroy on 17-7-14.
 */

import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
  GraphQLID
} from "graphql";
import { createRow, updateRow, updateTranslate } from "../../controllers/item";
import { RowType } from "../types/item";

export default {
  Public: {},
  Me: {
    createRow: {
      type: RowType,
      description: "创建项目中的一个条目",
      args: {
        argv: {
          type: new GraphQLInputObjectType({
            name: "CreateItemArgv",
            fields: {
              rid: {
                type: new GraphQLNonNull(GraphQLString),
                description: "项目ID"
              },
              key: {
                type: new GraphQLNonNull(GraphQLString),
                description: "关键子，只允许26个字母d"
              },
              value: {
                type: new GraphQLNonNull(GraphQLString),
                description: "翻译的字典"
              }
            }
          })
        }
      },
      async resolve(root: any, { argv }: any, req: any) {
        console.log(argv);
        const { key, rid, value } = argv;
        console.log(key, rid, value);
        const token = req.token;
        return await createRow({
          rid,
          uid: token.uid,
          key,
          value
        });
      }
    },
    updateRow: {
      type: RowType,
      description: "更新row",
      args: {
        argv: {
          type: new GraphQLInputObjectType({
            name: "UpdateRowArgv",
            fields: {
              id: {
                type: new GraphQLNonNull(GraphQLID),
                description: "Row 的ID"
              },
              key: {
                type: GraphQLString,
                description: "Row 的key"
              },
              description: {
                type: GraphQLString,
                description: "Row 的描述"
              },
              isActive: {
                type: GraphQLBoolean,
                description: "是否激活"
              }
            }
          })
        }
      },
      async resolve(root: any, { argv }: any, req: any) {
        const { id, key, description, isActive } = argv;
        const token = req.token;
        return await updateRow({
          id,
          uid: token.uid,
          key,
          description,
          isActive
        });
      }
    },
    updateItem: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: "更新字段",
      args: {
        rid: {
          type: new GraphQLNonNull(GraphQLID),
          description: "项目ID"
        },
        key: {
          type: new GraphQLNonNull(GraphQLString),
          description: "关键字"
        },
        language: {
          type: new GraphQLNonNull(GraphQLString),
          description: "语言"
        },
        value: {
          type: new GraphQLNonNull(GraphQLString),
          description: "翻译对应的值"
        }
      },
      async resolve(root: any, { rid, key, language, value }: any, ctx: any) {
        await updateTranslate({
          rid,
          key,
          language,
          value
        });
        return true;
      }
    }
  }
};
