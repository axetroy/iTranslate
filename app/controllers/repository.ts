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
import organizationMemberModel from "../postgres/models/organization.member.model";
import { defer } from "bluebird";
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

export interface AddCollaboratorArgv$ {
  uid: string;
  username: string;
  repoId: string;
}

export enum RepoRole {
  User = "user",
  Admin = "admin",
  Owner = "owner"
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
        role: RepoRole.Owner
      },
      { transaction: t }
    );

    if (!member) {
      throw new Error(`member can not be created`);
    }

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

    return row.dataValues;
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

    // 如果找不到对应的用户的话，那么去找组织
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

    if (!row) {
      throw new Error(`not found repo`);
    }

    await t.commit();

    return row.dataValues;
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

/**
 * 添加新成员
 * @param argv
 */
export async function AddCollaborator(argv: AddCollaboratorArgv$) {
  const { uid, username, repoId } = argv;
  const t = await sequelize.transaction();
  try {
    // 检查用户是否存在
    const [operator, collaborator, repo]: any[] = await Promise.all([
      UserModel.findOne({
        where: { uid },
        transaction: t,
        lock: t.LOCK.UPDATE
      }),
      UserModel.findOne({
        where: { username },
        transaction: t,
        lock: t.LOCK.UPDATE
      }),
      RepositoryModel.findOne({
        where: { id: repoId },
        transaction: t,
        lock: t.LOCK.UPDATE
      })
    ]);

    if (!operator || !collaborator) {
      throw new Error(`User not exist`);
    }

    if (!repo) {
      throw new Error(`repo not exist`);
    }

    async function checkPermission(): Promise<boolean> {
      // 操作人是项目拥有者，理应有权限
      if (repo.owner === uid) {
        return true;
      }

      // 查看看用户是否是这个项目的管理员
      if (
        await RepositoryMemberModel.findOne({
          where: {
            repoId: repo.id,
            uid,
            role: RepoRole.Admin
          },
          transaction: t,
          lock: t.LOCK.UPDATE
        })
      ) {
        return true;
      }

      // 看看中国仓库是不是组织所有
      const repoOrg: any = await OrganizationModel.findOne({
        where: { id: repo.owner },
        transaction: t,
        lock: t.LOCK.UPDATE
      });

      // 这里找不到组织
      // 说明项目是个人项目
      // 而操作者又不是这个个人项目的管理员，理应抛出没有权限的错误
      if (!repoOrg) {
        return false;
      }

      // 如果项目是组织所有
      // 检查用户在不在组织内，并且也是管理员
      if (
        await organizationMemberModel.findOne({
          where: { uid, orgId: repoOrg.id, role: RepoRole.Admin },
          transaction: t,
          lock: t.LOCK.UPDATE
        })
      ) {
        return true;
      }

      // 所有情况都没有捕捉的情况下
      // 建议返回false
      // 没有权限操作，保险起见
      return false;
    }

    // 验证操作者是否拥有权限
    if ((await checkPermission()) === false) {
      throw new Error(`你没有权限这么做..`);
    }

    // 查找看看是否已有这个成员存在
    if (
      await RepositoryMemberModel.findOne({
        where: {
          uid: collaborator.uid,
          repoId: repo.id
        },
        transaction: t
      })
    ) {
      throw new Error(`该用户已是项目成员`);
    }

    // 添加组织成员
    const newMember: any = await RepositoryMemberModel.create(
      {
        uid: collaborator.uid,
        repoId: repo.id,
        role: RepoRole.User
      },
      {
        transaction: t
      }
    );

    await t.commit();

    return newMember.dataValues;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}
