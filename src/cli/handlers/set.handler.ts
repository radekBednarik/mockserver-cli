import { globalOptsHandler } from "./globalOpts.handler.js";
import { getAllFilePaths } from "../../io/io.js";
import type { OptionValues } from "commander";

export async function setHandler(paths: string[], options: OptionValues) {
  const { config, concurrency } = await globalOptsHandler(options);

  console.log(config, concurrency);

  const allPaths = [];

  for (const path of paths) {
    const expectationsPaths = await getAllFilePaths(path);
    allPaths.push(...expectationsPaths);
  }
}
