/**
 * Created by axetroy on 17-7-13.
 */
import { EventEmitter } from "events";
import * as Router from "koa-router";
import * as Koa from "koa";
import * as cors from "@koa/cors";

import sequelize from "./postgres/index";

// Routers
import GraphqlRouter from "./routers/graphql";
import exportsRouter from "./routers/exports";
import { initUser } from "./controllers/user";

const app = new Koa();

app.use(
  cors({
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// 端口监听
const SERVER_PORT: number = Number(process.env.PORT) || 3000;

process.on("uncaughtException", function(err) {
  console.error("Error caught in uncaughtException event:", err);
});

process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at:", p, "reason:", reason);
});

class Program extends EventEmitter {
  private ERROR: string = "error";
  constructor() {
    super();
    this.on(this.ERROR, (err: Error) => {
      console.error(`Program Init Fail.`);
      console.error(err);
      process.exit(1);
    });
  }

  /**
   * 启动程序
   * @returns {Promise<void>}
   */
  async bootstrap(): Promise<void> {
    try {
      await this.onOrm();
      await this.onInitData();
      await [this.onServer()];
    } catch (err) {
      this.emit(this.ERROR, err);
    }
  }

  /**
   * 初始化orm的连接
   * @returns {Promise<void>}
   */
  async onOrm(): Promise<void> {
    // sequelize的初始化
    await sequelize.authenticate();
    await sequelize.sync();
    console.info(`所有ORM连接成功`);
  }

  /**
   * 初始化数据，例如默认配置
   * @returns {Promise<any>}
   */
  async onInitData(): Promise<void> {
    await initUser();
    console.info(`初始化数据成功`);
  }

  /**
   * 启动http服务
   * @param {number} port
   * @returns {Promise<any>}
   */
  async onServer(port: number = SERVER_PORT): Promise<any> {
    // graphql 接口
    const ApiRouter = new Router({ prefix: "/api" });
    const Graphql = GraphqlRouter();
    const Exports = exportsRouter();
    ApiRouter.use("/graphql", Graphql.routes(), Graphql.allowedMethods());
    ApiRouter.use("/exports", Exports.routes(), Exports.allowedMethods());

    app.use(ApiRouter.routes());
    app.use(ApiRouter.allowedMethods());

    app.use(ctx => {
      ctx.status = 404;
      ctx.body = {
        error: [{ message: "Invalid url" }]
      };
    });

    return new Promise((resolve, reject) => {
      app.listen(port, () => {
        console.info(`HTTP服务 监听 ${port} 端口`);
        resolve();
      });
    });
  }
}

new Program().bootstrap();
