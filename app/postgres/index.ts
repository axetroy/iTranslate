/**
 * Created by axetroy on 2017/7/22.
 */
import * as Sequelize from 'sequelize';
// const Sequelize = require('sequelize');
import CONFIG from '../config';

const isDevelopment: boolean = CONFIG.isDevelopment;

const db = CONFIG.db;

const sequelize = new Sequelize(db.database, db.username, db.password, {
  dialect: 'postgres',
  host: db.host,
  port: db.port,
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
});

export default sequelize;
