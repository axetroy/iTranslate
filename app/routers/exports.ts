import * as Router from "koa-router";

import {
  rawHandler,
  exportHandler,
  rawMultipleFile
} from "../controllers/exports";

export default () => {
  const router = new Router();
  router.get("/raw/:tid.:ext", rawHandler);
  router.get("/raw/multi/:ext/:ids", rawMultipleFile);
  router.get("/export/:tid.:ext", exportHandler);
  return router;
};
