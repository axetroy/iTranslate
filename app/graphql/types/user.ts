/**
 * Created by axetroy on 17-7-13.
 */
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLID,
  GraphQLBoolean
} from "graphql";

import { generateListType } from "./generate-list";
import { getUserInfo } from "../../controllers/user";

const userInfoType = new GraphQLObjectType({
  name: "UserInfoType",
  fields: {
    uid: {
      type: new GraphQLNonNull(GraphQLID)
    },
    username: {
      type: new GraphQLNonNull(GraphQLString)
    },
    nickname: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }
});

export function getUserInfoFromField(field = "uid", nonnull = true) {
  return {
    type: userInfoType,
    async resolve(parent: any, params: any, req: any) {
      const uid: string = parent[field];
      try{
        return await getUserInfo(uid);
      }catch(err){
        if (nonnull){
          throw err;
        }else{
          return null
        }
      }
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

export const PublicUser = new GraphQLObjectType({
  name: "PublicUserInfoType",
  description: "公开的用户信息, 这里不应该包含敏感字段",
  fields: {
    username: {
      type: new GraphQLNonNull(GraphQLString)
    },
    nickname: {
      type: new GraphQLNonNull(GraphQLString)
    },
    email: {
      type: GraphQLString,
      description: "用户邮箱由用户决定是否公开"
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
      description: "用户创建时间"
    }
  }
});

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
    isOrganization: {
      type: GraphQLBoolean,
      description: "是否是组织"
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString)
    },
    updatedAt: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }
});

export const UserListType = generateListType(UserType);

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
    },
    email: {
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
