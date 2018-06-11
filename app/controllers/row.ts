/**
 * Created by axetroy on 17-7-19.
 */
import ItemModel from "../postgres/models/item.model";
import sequelize from "../postgres/index";
import { RFC3339NanoMaper, initQuery, sortMap } from "../utils";
import { FormQuery$ } from "../graphql/types/formQuery";

export interface CreateRowArgv$ {
  uid: string;
  tid: string;
  key: string;
  value_en: string;
  value_cn: string;
  value_tw: string;
}

export interface UpdateRowArgv$ {
  id: string;
  uid: string;
  key?: string;
  value_en?: string;
  value_cn?: string;
  value_tw?: string;
  isActive?: boolean;
}

/**
 * 创建row
 * @param {CreateRowArgv$} argv
 * @returns {Promise<any>}
 */
export async function createRow(argv: CreateRowArgv$) {
  const { tid, uid, key, value_cn, value_en, value_tw } = argv;

  if (/^[a-z]+$/i.test(key) !== true) {
    throw new Error(`Invalid Key, Key must be [a-z, A-Z]`);
  }

  const t: any = await sequelize.transaction();
  try {
    const oldRow = await ItemModel.findOne({
      where: { tid, uid, key },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (oldRow) {
      throw new Error(`row exist`);
    }

    const row: any = await ItemModel.create(
      {
        tid,
        uid,
        key,
        value_en,
        value_cn,
        value_tw
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
  const { id, uid, key, value_cn, value_en, value_tw, isActive } = argv;

  if (key && /^[a-z]+$/i.test(key) !== true) {
    throw new Error(`Invalid Key, Key must be [a-z, A-Z]`);
  }

  const t: any = await sequelize.transaction();
  try {
    const row: any = await ItemModel.findOne({
      where: { id },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!row) {
      throw new Error(`No data`);
    }

    // const havePermission: boolean = await hasMember(row.tid, uid);

    // if (havePermission !== true) {
    //   throw new Error(`Permission deny`);
    // }

    if (key) {
      await row.update({ key }, { transaction: t, lock: t.LOCK.UPDATE });
    }

    if (value_cn) {
      await row.update({ value_cn }, { transaction: t, lock: t.LOCK.UPDATE });
    }

    if (value_en) {
      await row.update({ value_en }, { transaction: t, lock: t.LOCK.UPDATE });
    }

    if (value_tw) {
      await row.update({ value_tw }, { transaction: t, lock: t.LOCK.UPDATE });
    }

    if (isActive) {
      await row.update({ isActive }, { transaction: t, lock: t.LOCK.UPDATE });
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
 * @param {string} tid
 * @param {string} key
 * @returns {Promise<any>}
 */
export async function getRow(uid: string, tid: string, key: string) {
  const t: any = await sequelize.transaction();

  try {
    const row: any = await ItemModel.findOne({
      where: {
        // uid,
        tid,
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
