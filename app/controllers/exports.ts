import * as fs from "fs-extra";
import * as path from "path";
import { getRowList } from "./item";
import { getRepository } from "./repository";

async function getRawFile(tableId: string, ext: string) {
  const result = await getRowList({
    limit: 10000,
    keyJson: JSON.stringify({ tid: tableId })
  });

  // TODO
  const table = await getRepository("", tableId);

  const data = result.data;

  // default transform
  let transformer = function(data: any, tableName: string) {
    return `Can not transform ${ext} file`;
  };

  try {
    transformer = require(`./transformer/${ext}`);
  } catch (err) {
    transformer = require(`./transformer/default`);
  }

  transformer = transformer["default"] ? transformer["default"] : transformer;

  return transformer(data, table.name);
}

/**
 * 合并多个文件
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function rawMultipleFile(req, res) {
  try {
    const ext = req.params.ext;
    const ids = req.params.ids.split(",");

    // default transform
    let transformer = function(data: any, tableName: string) {
      return `Can not transform ${ext} file`;
    };

    try {
      transformer = require(`./transformer/${ext}`);
    } catch (err) {
      transformer = require(`./transformer/default`);
    }

    transformer = transformer["default"] ? transformer["default"] : transformer;

    let data = [];

    for (let i = 0; i < ids.length; i++) {
      const tid = ids[i];
      // TODO
      const table = await getRepository("", tid);
      const result = await getRowList({
        limit: 10000,
        keyJson: JSON.stringify({ tid })
      });

      result.data.forEach((v, i) => {
        result.data[i].tableName = table.name;
      });

      data = data.concat(result.data);
    }

    const raw = transformer(data, "");

    if (req.query.format == true) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.render("code", {
        code: raw
      });
    } else {
      res.send(raw);
    }
  } catch (err) {
    res.send({ message: err.message });
  }
}

export async function rawHandler(req, res) {
  const tid = req.params.tid;
  const ext = req.params.ext;
  try {
    const raw: string = await getRawFile(tid, ext);

    if (!!req.query.format) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.render("code", {
        code: raw
      });
    } else {
      res.send(raw);
    }
  } catch (err) {
    res.send(err.message);
  }
}

export async function exportHandler(req, res) {
  const tid = req.params.tid;
  const ext = req.params.ext;
  try {
    res.setHeader("Content-Type", "application/octet-stream; charset=utf-8");

    const newFile: string = path.join(process.cwd(), ".temp", `${tid}.${ext}`);

    await fs.ensureFile(newFile);

    const raw: string = await getRawFile(tid, ext);

    await fs.writeFile(newFile, raw);

    fs.createReadStream(newFile).pipe(res);
  } catch (err) {
    res.send(err.message);
  }
}
