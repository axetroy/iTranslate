import { FormQuery$ } from "../graphql/types/formQuery";
import { RepositoryRole } from "../graphql/types/member";
import sequelize from "../postgres/index";
import RepositoryMemberModel from "../postgres/models/repository.member.model";
import RepositoryModel from "../postgres/models/repository.model";
import UserModel from "../postgres/models/user.model";
import { initQuery, sortMap } from "../utils";
import { getRepository } from "./repository";

export interface AddCollaboratorArgv$ {
  uid: string;
  username: string;
  repoId: string;
}

/**
 * 添加新成员
 * @param argv
 */
export async function addCollaborator(argv: AddCollaboratorArgv$) {
  const { uid, username, repoId } = argv;
  const t = await sequelize.transaction();
  try {
    // 检查用户是否存在
    const [operator, collaborator, repo]: any[] = await Promise.all([
      UserModel.findOne({
        where: { uid, isActive: true },
        transaction: t,
        lock: t.LOCK.UPDATE
      }),
      UserModel.findOne({
        where: { username, isActive: true },
        transaction: t,
        lock: t.LOCK.UPDATE
      }),
      RepositoryModel.findOne({
        where: { id: repoId, isActive: true },
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

    console.log(`检验是否拥有权限...`);

    const operatorMember: any = await RepositoryMemberModel.findOne({
      where: {
        repoId: repo.id,
        uid,
        isActive: true
      },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    // 验证操作者是否拥有权限
    if (
      !operatorMember ||
      ![RepositoryRole.Admin, RepositoryRole.Owner].includes(
        operatorMember.role
      )
    ) {
      throw new Error(`你没有权限这么做..`);
    }

    // 查找看看是否已有这个成员存在
    const member: any = await RepositoryMemberModel.findOne({
      where: {
        uid: collaborator.uid,
        repoId: repo.id
      },
      transaction: t
    });

    if (member) {
      // 如果该项目成员还可用的话
      if (member.isActive) {
        throw new Error(`该用户已是项目成员`);
      }
      // 如果之前以是成员，但是被删除了，所以 isActive 为 false
      else {
        // 恢复这个 member ，并且设置为默认的User权限
        await member.update(
          { isActive: true, role: RepositoryRole.User },
          { transaction: t, lock: t.LOCK.UPDATE }
        );
        const data = member.dataValues;
        await t.commit();
        return data;
      }
    } else {
      // 添加组织成员
      const newMember: any = await RepositoryMemberModel.create(
        {
          uid: collaborator.uid,
          repoId: repo.id,
          role: RepositoryRole.User
        },
        {
          transaction: t
        }
      );

      const data = newMember.dataValues;

      await t.commit();

      return data;
    }
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

/**
 * 获取项目成员列表
 * @param query
 * @param filter
 */
export async function getCollaborators(query: FormQuery$, filter = {}) {
  const { page, limit, skip, sort, keyJson, songo } = initQuery(query);

  try {
    const result: any = {};
    const queryResult: any = await RepositoryMemberModel.findAndCountAll({
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
 * 获取项目成员列表
 * @param query
 * @param filter
 */
export async function getCollaboratorsByRepoName(
  owner: string,
  repoName: string,
  query: FormQuery$,
  filter = {}
) {
  const { page, limit, skip, sort, keyJson, songo } = initQuery(query);

  try {
    // 获取项目
    const repo = await getRepository(owner, repoName);

    const result: any = {};
    const queryResult: any = await RepositoryMemberModel.findAndCountAll({
      limit,
      offset: limit * page,
      order: sortMap(sort),
      where: {
        ...songo,
        ...filter,
        isActive: true,
        repoId: repo.id
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
 * 更改用户在某个项目中的角色
 * @param uid
 * @param collaboratorsId
 * @param repoId
 * @param role
 */
export async function updateCollaboratorsRole(
  uid: string,
  collaboratorsId: string,
  repoId: string,
  role: RepositoryRole
) {
  const validRoles = [
    RepositoryRole.Visitor,
    RepositoryRole.User,
    RepositoryRole.Admin
  ];

  if (!validRoles.includes(role)) {
    throw new Error(`要更新的角色无效`);
  }

  const t = await sequelize.transaction();

  try {
    // 获取项目信息
    const repo: any = await RepositoryModel.findOne({
      where: { id: repoId, isActive: true },
      transaction: t
    });

    if (!repo) {
      throw new Error(`项目不存在`);
    }

    // 验证操作者的权限
    const operator: any = await RepositoryMemberModel.findOne({
      where: {
        uid,
        repoId,
        isActive: true
      },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    // 如果没有找到相关的记录
    // 或者身份不是管理员或者拥有者
    if (
      !operator ||
      ![RepositoryRole.Admin, RepositoryRole.Owner].includes(operator.role)
    ) {
      throw new Error(`无权限操作`);
    }

    // 找到对应的成员
    const member: any = await RepositoryMemberModel.findOne({
      where: {
        uid: collaboratorsId,
        repoId,
        isActive: true
      },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!member) {
      throw new Error(`用户不存在这个项目`);
    }

    if (member.role === RepositoryRole.Owner) {
      throw new Error(`不能修改所有者`);
    }

    // 更新角色
    await member.update({ role }, { transaction: t, lock: t.LOCK.UPDATE });

    const data = member.dataValues;

    await t.commit();

    return data;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

/**
 * 从项目中移除协作者
 * @param uid
 * @param collaboratorsId
 * @param repoId
 */
export async function removeCollaborators(
  uid: string,
  collaboratorsId: string,
  repoId: string
) {
  const t = await sequelize.transaction();

  try {
    // 验证操作者的权限
    const operator: any = await RepositoryMemberModel.findOne({
      where: {
        uid,
        repoId,
        isActive: true
      },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    // 如果没有找到相关的记录
    // 或者身份不是管理员或者拥有者
    if (
      !operator ||
      ![RepositoryRole.Admin, RepositoryRole.Owner].includes(operator.role)
    ) {
      throw new Error(`无权限操作`);
    }

    // 找到对应的成员
    const member: any = await RepositoryMemberModel.findOne({
      where: {
        uid: collaboratorsId,
        repoId,
        isActive: true
      },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!member) {
      throw new Error(`用户不存在这个项目`);
    }

    if (member.role === operator.role) {
      throw new Error(`不能删除同级别的成员`);
    }

    // 更新角色
    await member.update(
      { isActive: false },
      { transaction: t, lock: t.LOCK.UPDATE }
    );

    const data = member.dataValues;

    await t.commit();

    return data;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}
