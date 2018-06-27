/**
 * Created by axetroy on 17-7-19.
 */
import * as _ from "lodash";
import UserModel from "../postgres/models/user.model";
import sequelize from "../postgres/index";
import { md5, initQuery, sortMap } from "../utils";
import { FormQuery$ } from "../graphql/types/formQuery";
import * as Sequelize from "sequelize";

// service
import { generateToken, verifyToken } from "../service/jwt";

export interface CreateArgv$ {
  username: string;
  password: string;
  email: string;
  roles?: string[];
}

export interface LoginArgv$ {
  username: string;
  password: string;
}

export interface UpdateUserArgv$ {
  uid: string;
  nickname?: string;
}

export async function initUser() {
  try {
    await createUser({
      username: "admin",
      password: "admin",
      email: "admin@admin.com",
      roles: ["user", "admin"]
    });
  } catch {}
}

export async function createUser(argv: CreateArgv$): Promise<any> {
  const { username, password, email } = argv;
  const t: any = await sequelize.transaction();
  try {
    const user: any = await UserModel.findOne({
      where: {
        [sequelize.Op.or]: [{ username }, { email }]
      },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (user) {
      throw new Error(`User exist!`);
    }

    const md5Password: string = md5(password);
    const row: any = await UserModel.create(
      {
        username,
        nickname: username,
        email,
        password: md5Password,
        roles: ["user"]
      },
      {
        transaction: t
      }
    );
    const data = row.dataValues;

    data.token = generateToken(row.uid);

    await t.commit();
    return data;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

export async function login(argv: LoginArgv$) {
  const { username, password } = argv;
  const t: any = await sequelize.transaction();
  try {
    const row: any = await UserModel.findOne({
      where: { username, password: md5(password) },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!row) {
      throw new Error(`User not exist`);
    }

    const data = row.dataValues;

    data.token = generateToken(row.uid);

    await verifyToken(data.token);

    await t.commit();

    return data;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

export async function getUserInfo(uid: string) {
  const t: any = await sequelize.transaction();
  try {
    const row: any = await UserModel.findOne({
      where: { uid },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!row) {
      throw new Error(`User ${uid} not exist!`);
    }

    const data = row.dataValues;
    await t.commit();
    return data;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

export async function getUserInfoByUsername(username: string) {
  const t: any = await sequelize.transaction();
  try {
    const row: any = await UserModel.findOne({
      where: { username },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!row) {
      throw new Error(`User ${username} not exist!`);
    }

    const data = row.dataValues;
    await t.commit();
    return data;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

export async function getUserInfoByName(name: string) {
  const t: any = await sequelize.transaction();
  try {
    const row: any = await UserModel.findOne({
      where: { username: name },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!row) {
      throw new Error(`User ${name} not exist!`);
    }

    const data = row.dataValues;
    await t.commit();
    return data;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

export async function getUserList(query: FormQuery$) {
  let { page, limit, skip, sort, keyJson, songo } = initQuery(query);

  try {
    const result: any = {};
    const queryResult: any = await UserModel.findAndCountAll({
      limit,
      offset: limit * page,
      order: sortMap(sort),
      where: {
        ...songo,
        isActive: true
      }
    });
    const rows = queryResult.rows || [];
    const count = queryResult.count || 0;
    const data = rows.map((row: any) => row.dataValues);
    result.data = data;
    result.meta = {
      page,
      limit,
      skip,
      count,
      num: data.length,
      sort,
      keyJson
    };
    return result;
  } catch (err) {
    throw err;
  }
}

export async function updateUserInfo(argv: UpdateUserArgv$) {
  const { uid, nickname } = argv;
  const t: any = await sequelize.transaction();
  try {
    const row: any = await UserModel.findOne({
      where: { uid },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!row) {
      throw new Error(`User ${name} not exist!`);
    }

    if (_.isString(nickname)) {
      await row.update({ nickname }, { transaction: t, lock: t.LOCK.UPDATE });
    }

    const data = row.dataValues;
    await t.commit();
    return data;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

export async function searchUser(username: string) {
  const result: any = {};
  const queryResult: any = await UserModel.findAndCountAll({
    where: {
      username: {
        [Sequelize.Op.like]: "%" + username + "%"
      }
    }
  });
  const rows = queryResult.rows || [];
  const count = queryResult.count || 0;
  const data = rows.map((row: any) => row.dataValues);
  result.data = data;
  result.meta = {
    page: 0,
    limit: 0,
    skip: 0,
    count,
    num: data.length,
    sort: "",
    keyJson: ""
  };
  return result;
}
