import * as _ from "lodash";
import OrganizationModel from "../postgres/models/organization.model";
import OrganizationMemberModel from "../postgres/models/organization.member.model";
import sequelize from "../postgres/index";
import { initQuery, sortMap } from "../utils";
import { FormQuery$ } from "../graphql/types/formQuery";

import { getUserInfoByName, getUserInfo } from "./user";

export interface createOrganizationArgv$ {
  uid: string; // 操作人
  name: string; // 组织名称
  description: string; // 组织描述
}

export interface UpdateOrganizationArgv$ {
  uid: string; // 操作人
  name?: string; // 组织名称
  description?: string; // 组织描述
}

/**
 * 创建table
 * @param {createRepositoryArgv$} argv
 * @returns {Promise<any>}
 */
export async function createOrganization(argv: createOrganizationArgv$) {
  const { uid, name, description } = argv;

  // 规范的校验key
  if (/^[a-z]+$/i.test(name) !== true) {
    throw new Error(`Invalid Organization Name.`);
  }

  const t: any = await sequelize.transaction();

  try {
    const organization = await OrganizationModel.findOne({
      where: { name }, // 组织名称不能重复
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (organization) {
      throw new Error(`organization have exist!`);
    }

    // 创建仓库
    const row: any = await OrganizationModel.create(
      {
        creator: uid,
        owner: uid,
        name,
        description
      },
      { transaction: t }
    );

    // 创建组织成员
    const member = await OrganizationMemberModel.create(
      {
        uid,
        orgId: row.id,
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

export async function updateOrganization(argv: UpdateOrganizationArgv$) {
  const { uid, name, description } = argv;

  if (name && /^[a-z]+$/i.test(name) !== true) {
    throw new Error(`Invalid Key, Key must be [a-z, A-Z]`);
  }

  const t: any = await sequelize.transaction();

  try {
    const organization: any = await OrganizationModel.findOne({
      where: { name }, // 组织名称不能重复
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!organization) {
      throw new Error(`organization not exist!`);
    }

    if (_.isString(name)) {
      await organization.update(
        { name },
        { transaction: t, lock: t.LOCK.UPDATE }
      );
    }

    if (_.isString(description)) {
      await organization.update(
        { description },
        { transaction: t, lock: t.LOCK.UPDATE }
      );
    }

    await t.commit();

    const data = organization.dataValues;

    return data;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

export async function getOrganization(uid: string, name: string) {
  const t: any = await sequelize.transaction();

  try {
    const row: any = await OrganizationModel.findOne({
      where: { name, owner: uid },
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

export async function getPublicOrganization(name: string) {
  const t: any = await sequelize.transaction();

  try {
    const row: any = await OrganizationModel.findOne({
      where: { name },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!row) {
      throw new Error(`组织不存在`);
    }

    const data = row.dataValues;

    await t.commit();

    return data;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

export async function getOrganizations(
  uid: string,
  query: FormQuery$,
  filter = {}
) {
  const { page, limit, skip, sort, keyJson, songo } = initQuery(query);

  try {
    const result: any = {};
    const queryResult: any = await OrganizationModel.findAndCountAll({
      limit,
      offset: limit * page,
      order: sortMap(sort),
      where: {
        ...songo,
        ...filter,
        owner: uid,
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
