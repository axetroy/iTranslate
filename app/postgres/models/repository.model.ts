/**
 * Created by axetroy on 2017/7/22.
 */
import * as Sequelize from "sequelize";
import sequelize from "../index";

const UNIT_KEY = "uid_name";

export default sequelize.define("repository", {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false
  },
  // 创建人
  creator: {
    type: Sequelize.UUID,
    allowNull: false
  },
  // 仓库拥有人
  owner: {
    type: Sequelize.UUID,
    unique: UNIT_KEY, // 联合唯一
    allowNull: false
  },
  // 仓库名字
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: UNIT_KEY // 联合唯一
  },
  languages: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    allowNull: false
  },
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
  },
  // 是否是私有库
  isPrivate: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    defaultValue: false
  }
});
