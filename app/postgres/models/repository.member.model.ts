/**
 * Created by axetroy on 2017/7/22.
 */
import * as Sequelize from "sequelize";
import sequelize from "../index";

const UNIT_KEY = "uid_repoid";

export default sequelize.define("repository-member", {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false
  },
  // 用户的UUID
  uid: {
    type: Sequelize.UUID,
    unique: UNIT_KEY, // 联合唯一
    allowNull: false
  },
  // 仓库ID
  repoId: {
    type: Sequelize.UUID,
    unique: UNIT_KEY, // 联合唯一
    allowNull: false
  },
  // 用户在该项目中所属的角色
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
