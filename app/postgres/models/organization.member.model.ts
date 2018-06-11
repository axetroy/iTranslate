/**
 * Created by axetroy on 2017/7/22.
 */
import * as Sequelize from "sequelize";
import sequelize from "../index";

const UNIT_KEY = "uid_name";

export default sequelize.define("organization-member", {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false
  },
  // 用户的UUID
  uid: {
    type: Sequelize.UUID,
    allowNull: false,
    unique: UNIT_KEY // 联合唯一
  },
  // 组织ID
  orgId: {
    type: Sequelize.UUID,
    allowNull: true,
    unique: UNIT_KEY // 联合唯一
  },
  // 用户在该组织中所属的角色
  role: {
    type: Sequelize.STRING,
    allowNull: false
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    defaultValue: true
  }
});
