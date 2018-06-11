/**
 * Created by axetroy on 17-7-13.
 */
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const PROJECT_ROOT_PATH: string = path.join(__dirname, '../');

const PROJECT_CONFIG_PATH: string =
  process.env.NODE_ENV === 'production'
    ? path.join(PROJECT_ROOT_PATH, 'config.yaml')
    : path.join(PROJECT_ROOT_PATH, 'config.dev.yaml');

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

const YML_CONFIG: CONFIG$ = yaml.safeLoad(fs.readFileSync(PROJECT_CONFIG_PATH, 'utf8'));

const NODE_ENV = process.env.NODE_ENV;

const CONFIG: CONFIG$ = <CONFIG$>{
  ...YML_CONFIG,
  ...{
    NODE_ENV: NODE_ENV,
    isProduction: NODE_ENV === 'production',
    isDevelopment: NODE_ENV === 'development',
    isTest: NODE_ENV === 'test'
  },
  ...{
    path: {
      root: './',
      app: './app',
      build: './build',
      generation: './generation'
    }
  }
};

export default CONFIG;
