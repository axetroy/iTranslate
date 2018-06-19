/**
 * Created by axetroy on 17-7-13.
 */
import { GraphQLNonNull, GraphQLString, GraphQLList } from "graphql";

export default {
  Public: {
    languages: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLString)),

      description: "获取支持的语言列表",
      async resolve() {
        const languages = require("../../../languages.json");
        return Object.keys(languages);
      }
    }
  },
  Me: {}
};
