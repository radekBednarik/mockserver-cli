import type { OptionValues } from "commander";
import Client from "../../client/client.js";
import { logger } from "../../log/logger.js";
import { getAllFilePaths, readJsonFile } from "../../io/io.js";
import { globalOptsHandler } from "./globalOpts.handler.js";
import { resolve } from "path";

const log = logger.child({ module: "clearHandler" });

async function clearExpectations(client: Client, path: string) {
  try {
    log.trace(`will clear expectations from path: ${path}`);

    const expectations = await readJsonFile(resolve(path));

    for (const expectation of expectations) {
      await client.clear(expectation, "EXPECTATIONS");
    }

    log.trace(`expectations cleared on the server - from path: ${path}`);
  } catch (error: any) {
    log.error("Error clearing expectations:", error);
  }
}

export async function clearHandler(paths: string[], options: OptionValues) {
  try {
    log.trace(`Handling clear command with args: ${JSON.stringify({ paths, options })}`);

    const opts = await globalOptsHandler(options);

    const allPaths: string[] = [];

    for (const path of paths) {
      const expectationsPaths = await getAllFilePaths(path);
      allPaths.push(...expectationsPaths);
    }

    log.trace(`All expectations filepaths resolved to: ${JSON.stringify(allPaths)}`);

    const client = new Client({
      proto: opts["config"]["proto"],
      host: opts["config"]["host"],
      port: opts["config"]["port"],
    });

    for (const path of allPaths) {
      await clearExpectations(client, path);
    }

    log.trace("Expectations cleared");
  } catch (error: any) {
    log.error(error.message);
    throw error;
  }
}
