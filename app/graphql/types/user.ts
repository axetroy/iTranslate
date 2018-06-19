/**
 * Created by axetroy on 17-7-13.
 */
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType
} from "graphql";

import { getUserInfo } from "../../controllers/user";

export function getUserInfoFromField(field = "uid") {
  return {
    type: new GraphQLObjectType({
      name: "UserInfoType" + field,
      fields: {
        uid: {
          type: new GraphQLNonNull(GraphQLString)
        },
        username: {
          type: new GraphQLNonNull(GraphQLString)
        },
        nickname: {
          type: new GraphQLNonNull(GraphQLString)
        }
      }
    }),
    async resolve(parent: any, params: any, req: any) {
      const uid: string = parent[field];
      return await getUserInfo(uid);
    }
  };
}

export const user = {
  type: new GraphQLObjectType({
    name: "UserInfoType",
    fields: {
      uid: {
        type: new GraphQLNonNull(GraphQLString)
      },
      username: {
        type: new GraphQLNonNull(GraphQLString)
      },
      nickname: {
        type: new GraphQLNonNull(GraphQLString)
      }
    }
  }),
  async resolve(parent: any, params: any, req: any) {
    const uid: string = parent.uid;
    return await getUserInfo(uid);
  }
};

export const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: {
    uid: {
      type: new GraphQLNonNull(GraphQLString)
    },
    username: {
      type: new GraphQLNonNull(GraphQLString)
    },
    nickname: {
      type: new GraphQLNonNull(GraphQLString)
    },
    roles: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLString))
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString)
    },
    updatedAt: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }
});

export const LoginType = new GraphQLObjectType({
  name: "LoginType",
  fields: {
    uid: {
      type: new GraphQLNonNull(GraphQLString)
    },
    username: {
      type: new GraphQLNonNull(GraphQLString)
    },
    nickname: {
      type: new GraphQLNonNull(GraphQLString)
    },
    roles: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLString))
    },
    token: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Token"
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString)
    },
    updatedAt: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }
});

export const RegisterArgv = new GraphQLInputObjectType({
  name: "RegistryArgv",
  fields: {
    username: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }
});

export const LoginArgv = new GraphQLInputObjectType({
  name: "LoginArgv",
  fields: {
    username: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }
});

export const UpdateUserArgv = new GraphQLInputObjectType({
  name: "UpdateUserArgv",
  fields: {
    nickname: {
      type: GraphQLString
    }
  }
});
