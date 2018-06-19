/**
 * Created by axetroy on 2017/7/22.
 */
import * as Sequelize from "sequelize";
// const Sequelize = require('sequelize');
import CONFIG from "../config";

const isDevelopment: boolean = CONFIG.isDevelopment;

const sequelize = new Sequelize(
  process.env.DB_DATABASENAME as string,
  process.env.DB_USERNAME as string,
  process.env.DB_PASSWORD as string,
  {
    dialect: "postgres",
    host: process.env.DB_HOST,
    port: +(process.env.DB_PORT as string),
    pool: {
      max: 200,
      min: 5,
      // the minimum amount of time that an object may sit idle in the pool before it is eligible for eviction due to idle time.
      // Supercedes softIdleTimeoutMillis Default: 30000
      idle: 1000 * 10,
      // max milliseconds an acquire call will wait for a resource before timing out.
      // (default no limit), if supplied should non-zero positive integer.
      acquire: 1000 * 10,
      // How often to run eviction checks. Default: 0 (does not run).
      evict: 1000 * 10
    },
    // native: true,
    retry: {
      max: 2
    },
    logging(message: string) {
      isDevelopment && console.log(message);
    },
    dialectOptions: {
      connectTimeout: 30 * 1000
    },
    // isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    // transactionType: Sequelize.Transaction.TYPES.EXCLUSIVE,
    benchmark: isDevelopment
  }
);

export default sequelize;
