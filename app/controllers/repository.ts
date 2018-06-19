/**
 * Created by axetroy on 17-7-19.
 */
import * as _ from "lodash";
import UserModel from "../postgres/models/user.model";
import OrganizationModel from "../postgres/models/organization.model";
import RepositoryModel from "../postgres/models/repository.model";
import RepositoryMemberModel from "../postgres/models/repository.member.model";
import sequelize from "../postgres/index";
import { initQuery, sortMap } from "../utils";
import { FormQuery$ } from "../graphql/types/formQuery";
const supportLanguages = require("../../languages.json");

export interface createRepositoryArgv$ {
  uid: string; // 操作人
  owner: string; // 仓库所有者
  name: string;
  languages: string[]; // 支持的语言
  description: string;
  isPrivate?: boolean; // 是否是私有仓库
  readme?: string; // 仓库说明
}

export interface UpdateRepositoryArgv$ {
  id: string;
  uid?: string;
  name?: string;
  languages?: string[]; // 支持的语言
  description?: string;
  isPrivate?: boolean; // 是否是私有仓库
  readme?: string; // 仓库说明
  isActive?: boolean;
}

export async function createRepository(argv: createRepositoryArgv$) {
  const { uid, owner, name, description, readme, isPrivate, languages } = argv;

  // 规范的校验key
  if (/^[a-z]+$/i.test(name) !== true) {
    throw new Error(`Invalid Key, Key must be [a-z, A-Z]`);
  }

  // 校验语言
  if (!languages.length) {
    throw new Error(`必须指定一个语言`);
  }

  // 检查是否支持该语言
  for (const lang of languages) {
    if (lang in supportLanguages === false) {
      throw new Error(`Not support languages ${lang}`);
    }
  }

  const t: any = await sequelize.transaction();

  try {
    const user = await UserModel.findOne({
      where: { uid },
      transaction: t
    });

    if (!user) {
      throw new Error(`User not exist!`);
    }

    const repository = await RepositoryModel.findOne({
      where: { owner, name }, // 查看拥有者是否已有现成的项目
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (repository) {
      throw new Error(`repository have exist!`);
    }

    // 创建仓库
    const row: any = await RepositoryModel.create(
      {
        creator: uid,
        owner,
        name,
        description,
        languages,
        readme,
        isPrivate
      },
      { transaction: t }
    );

    // 创建owner
    const member = await RepositoryMemberModel.create(
      {
        uid: owner,
        repoId: row.id,
        role: "owner"
      },
      { transaction: t }
    );

    const data = row.dataValues;

    await t.commit();

    return row.dataValues;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

export async function updateRepository(argv: UpdateRepositoryArgv$) {
  const { id, uid, name, description, languages, isActive, readme } = argv;

  if (name && /^[a-z]+$/i.test(name) !== true) {
    throw new Error(`Invalid Key, Key must be [a-z, A-Z]`);
  }

  if (languages) {
    // 校验语言
    if (!languages.length) {
      throw new Error(`必须指定一个语言`);
    }

    // 检查是否支持该语言
    for (const lang of languages) {
      if (lang in supportLanguages === false) {
        throw new Error(`Not support languages ${lang}`);
      }
    }
  }

  const t: any = await sequelize.transaction();

  try {
    const row: any = await RepositoryModel.findOne({
      where: {
        // TODO: 查询条件要兼容到组织
        id,
        owner: uid
      },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!row) {
      throw new Error(`No data`);
    }

    if (_.isString(name)) {
      await row.update({ name }, { transaction: t, lock: t.LOCK.UPDATE });
    }

    if (_.isString(description)) {
      await row.update(
        { description },
        { transaction: t, lock: t.LOCK.UPDATE }
      );
    }

    if (_.isArray(languages)) {
      await row.update({ languages }, { transaction: t, lock: t.LOCK.UPDATE });
    }

    if (_.isString(readme)) {
      await row.update({ readme }, { transaction: t, lock: t.LOCK.UPDATE });
    }

    if (_.isBoolean(isActive)) {
      await row.update({ isActive }, { transaction: t, lock: t.LOCK.UPDATE });
    }

    await t.commit();

    const data = row.dataValues;

    return data;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

export async function getRepository(owner: string, name: string) {
  const t: any = await sequelize.transaction();

  try {
    let user: any = await UserModel.findOne({
      where: {
        username: owner
      },
      transaction: t
    });

    // 如果找不到对应的用户的话，那么去着组织
    if (!user) {
      user = await OrganizationModel.findOne({
        where: {
          name: owner
        },
        transaction: t
      });
    }

    if (!user) {
      throw new Error(`User ${owner} is not exist!`);
    }

    const row: any = await RepositoryModel.findOne({
      where: {
        owner: user.uid,
        name
      },
      transaction: t
    });

    if (!row) {
      throw new Error(`repository not exist!`);
    }

    const data = row.dataValues;

    await t.commit();

    return data;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

export async function getRepositoryByUid(uid: string, name: string) {
  const t: any = await sequelize.transaction();

  try {
    const row: any = await RepositoryModel.findOne({
      where: {
        owner: uid,
        name
      },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    await t.commit();

    const data = row.dataValues;

    return data;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

export async function getRepositories(query: FormQuery$, filter = {}) {
  let { page, limit, skip, sort, keyJson, songo } = initQuery(query);

  try {
    const result: any = {};
    const queryResult: any = await RepositoryModel.findAndCountAll({
      limit,
      offset: limit * page,
      order: sortMap(sort),
      where: {
        ...songo,
        ...filter,
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
