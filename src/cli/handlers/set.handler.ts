import Client from "../../client/client.js";
import { getAllFilePaths, readJsonFile } from "../../io/io.js";
import { globalOptsHandler } from "./globalOpts.handler.js";
import { logger } from "../../log/logger.js";
import type { OptionValues } from "commander";
import type { Expectation } from "mockserver-client";
import { resolve } from "path";

const log = logger.child({ module: "setHandler" });

async function setExpectations(client: Client, expectations: Expectation | Expectation[]) {
  try {
    log.trace(`will set expectations: ${JSON.stringify(expectations)}`);

    await client.set(expectations);

    log.trace("expectations set");
  } catch (error: any) {
    log.error("Error setting expectations:", error);
  }
}

export async function setHandler(paths: string[], options: OptionValues) {
  try {
    log.trace(`Handling set command with args: ${JSON.stringify({ paths, options })}`);

    const opts = await globalOptsHandler(options);

    const allPaths: string[] = [];

    for (const path of paths) {
      const expectationsPaths = await getAllFilePaths(path);
      allPaths.push(...expectationsPaths);
    }

    log.trace(`All expectations filepaths resolved to: ${JSON.stringify(allPaths)}`);

    const client = new Client({ proto: opts["config"].proto, host: opts["config"].host, port: opts["config"].port });

    for (const path of allPaths) {
      const fullPath = resolve(path);

      log.trace(`Setting expectations from file: ${fullPath}`);

      const expectations: Expectation[] = await readJsonFile(fullPath);

      await setExpectations(client, expectations);
    }
  } catch (error: any) {
    log.error(error.message);
    throw error;
  }
}
