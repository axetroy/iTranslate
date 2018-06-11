/**
 * Created by axetroy on 2017/7/22.
 */
import * as Sequelize from "sequelize";
import sequelize from "../index";

const UNIT_KEY = "uid_name";

export default sequelize.define("organization", {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false
  },
  // 组织的所有者
  owner: {
    type: Sequelize.UUID,
    unique: UNIT_KEY, // 联合唯一
    allowNull: false
  },
  // 组织的创建者
  creator: {
    type: Sequelize.UUID,
    allowNull: false
  },
  // 组织名
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: UNIT_KEY // 联合唯一
  },
  // 组织描述
  description: {
    type: Sequelize.STRING,
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
