/**
 * Created by axetroy on 17-7-19.
 */
import ItemModel from "../postgres/models/item.model";
import sequelize from "../postgres/index";
import { initQuery, sortMap } from "../utils";
import { FormQuery$ } from "../graphql/types/formQuery";

export interface CreateRowArgv$ {
  uid: string;
  rid: string;
  key: string;
  value?: string;
}

export interface UpdateRowArgv$ {
  id: string;
  uid: string;
  key?: string;
  description?: string;
  value?: string;
  isActive?: boolean;
}

export interface UpdateTranslateArgv$ {
  rid: string;
  key: string;
  language: string;
  value: string;
}

/**
 * 创建row
 * @param {CreateRowArgv$} argv
 * @returns {Promise<any>}
 */
export async function createRow(argv: CreateRowArgv$) {
  const { rid, uid, key, value } = argv;

  if (/^[a-z]+$/i.test(key) !== true) {
    throw new Error(`Invalid Key, Key must be [a-z, A-Z]`);
  }

  if (!rid) {
    throw new Error(`repository id is required`);
  }

  if (!uid) {
    throw new Error(`user id is required`);
  }

  const t: any = await sequelize.transaction();
  try {
    const oldRow = await ItemModel.findOne({
      where: { rid, uid, key },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (oldRow) {
      throw new Error(`row exist`);
    }

    const row: any = await ItemModel.create(
      {
        rid,
        uid,
        key,
        value: JSON.parse(value || "{}")
      },
      {
        transaction: t
      }
    );

    await t.commit();

    return row.dataValues;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

/**
 * 更新row
 * @param {UpdateRowArgv$} argv
 * @returns {Promise<any>}
 */
export async function updateRow(argv: UpdateRowArgv$) {
  const { id, uid, key, value, description, isActive } = argv;

  if (key && /^[a-z]+$/i.test(key) !== true) {
    throw new Error(`Invalid Key, Key must be [a-z, A-Z]`);
  }

  const t: any = await sequelize.transaction();

  try {
    // TODO: 校验用户是否有权限去更新

    const row: any = await ItemModel.findOne({
      where: { id },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!row) {
      throw new Error(`No data`);
    }

    if (key) {
      await row.update({ key }, { transaction: t, lock: t.LOCK.UPDATE });
    }

    if (value) {
      await row.update(
        { value: JSON.parse(value) },
        { transaction: t, lock: t.LOCK.UPDATE }
      );
    }

    if (typeof description === "string") {
      await row.update(
        { description },
        { transaction: t, lock: t.LOCK.UPDATE }
      );
    }

    if (typeof isActive === "boolean") {
      await row.update({ isActive }, { transaction: t, lock: t.LOCK.UPDATE });
    }

    await t.commit();

    return row.dataValues;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

export async function updateTranslate(argv: UpdateTranslateArgv$) {
  const { rid, key, language, value } = argv;

  if (key && /^[a-z]+$/i.test(key) !== true) {
    throw new Error(`Invalid Key, Key must be [a-z, A-Z]`);
  }

  // TODO
  // 校验是否是合法的 language

  const t: any = await sequelize.transaction();
  try {
    const row: any = await ItemModel.findOne({
      where: { id: rid },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!row) {
      throw new Error(`No data`);
    }

    const originValue = row.dataValues.value;

    if (value) {
      const newValue = { ...originValue };
      newValue[language] = value;
      await row.update(
        { value: newValue },
        { transaction: t, lock: t.LOCK.UPDATE }
      );
    }

    await t.commit();

    return row.dataValues;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

/**
 * 获取row
 * @param {string} uid
 * @param {string} rid
 * @param {string} key
 * @returns {Promise<any>}
 */
export async function getRow(uid: string, rid: string, key: string) {
  const t: any = await sequelize.transaction();

  try {
    const row: any = await ItemModel.findOne({
      where: {
        // uid,
        rid,
        key,
        isActive: true
      },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!row) {
      throw new Error(`No data`);
    }

    await t.commit();

    return row.dataValues;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

/**
 * 获取列表
 * @returns {Promise<any>}
 */
export async function getRowList(query: FormQuery$) {
  let { page, limit, skip, sort, keyJson, songo } = initQuery(query);

  try {
    const result: any = {};
    const queryResult: any = await ItemModel.findAndCountAll({
      // limit,
      offset: limit * page,
      order: sortMap(sort),
      where: {
        ...songo,
        isActive: true
      }
    });
    const rows = queryResult.rows || [];
    const count = queryResult.count || 0;
    const data = rows.map((row: any) => {
      const d = row.dataValues;
      d.value = JSON.stringify(d.value);
      return d;
    });
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
