/**
 * Created by axetroy on 2017/7/22.
 */
import * as Sequelize from "sequelize";
import sequelize from "../index";

const UNIT_KEY = "tablekey_rowkey";

export default sequelize.define("row", {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false
  },
  // 仓库ID
  rid: {
    type: Sequelize.UUID,
    unique: UNIT_KEY, // 联合唯一
    allowNull: false
  },
  // UID， 创建者
  uid: {
    type: Sequelize.UUID,
    allowNull: false
  },
  // 序号
  code: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false
  },
  // Key值
  key: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: UNIT_KEY // 联合唯一
  },
  // 以JSON格式存储多语言的值
  value: {
    type: Sequelize.JSONB,
    allowNull: false
  },
  note: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: ""
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    defaultValue: true
  }
});
