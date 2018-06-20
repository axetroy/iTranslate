/**
 * Created by axetroy on 17-7-13.
 */
const path = require("path");

interface Db$ {
  host: string;
  database: string;
  username: string;
  password: string;
  port: number;
}

interface Path$ {
  root: string;
  app: string;
  build: string;
  generation: string;
}

interface CONFIG$ {
  name: string;
  UID_GUEST: string;
  UID_SYSTEM: string;
  userPubPath: string;
  adminPubPath: string;
  NODE_ENV: string;
  isProduction: boolean;
  isDevelopment: boolean;
  isTest: boolean;
  db: Db$;
  path: Path$;
}

const NODE_ENV = process.env.NODE_ENV;

const CONFIG: CONFIG$ = <CONFIG$>{
  ...{
    NODE_ENV: NODE_ENV,
    isProduction: NODE_ENV === "production",
    isDevelopment: NODE_ENV === "development",
    isTest: NODE_ENV === "test"
  },
  ...{
    path: {
      root: "./",
      app: "./app",
      build: "./build",
      generation: "./generation"
    }
  }
};

export default CONFIG;
