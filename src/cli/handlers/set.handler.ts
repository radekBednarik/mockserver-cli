import Client from "../../client/client.js";
import PQueue from "p-queue";
import { getAllFilePaths, readJsonFile } from "../../io/io.js";
import { globalOptsHandler } from "./globalOpts.handler.js";
import { logger } from "../../log/logger.js";
import { resolve } from "path";
import type { OptionValues } from "commander";
import type { Expectation } from "mockserver-client";
import { SuccessFullRequest } from "mockserver-client/mockServerClient.js";

const log = logger.child({ module: "setHandler" });

async function setExpectations(client: Client, expectations: Expectation | Expectation[]) {
  try {
    const response = (await client.set(expectations)) as SuccessFullRequest;

    return response;
  } catch (error: any) {
    log.error("Error setting expectations:", error);
    return null;
  }
}

export async function setHandler(paths: string[], options: OptionValues) {
  try {
    log.trace(`Handling set command with args: ${JSON.stringify({ paths, options })}`);

    const opts = await globalOptsHandler(options);
    const concurrency = parseInt(opts["concurrency"]);

    const allPaths: string[] = [];

    for (const path of paths) {
      const expectationsPaths = await getAllFilePaths(path);
      allPaths.push(...expectationsPaths);
    }

    log.trace(`All expectations filepaths resolved to: ${JSON.stringify(allPaths)}`);

    const client = new Client({ proto: opts["config"].proto, host: opts["config"].host, port: opts["config"].port });

    const queue = new PQueue({ concurrency });

    log.trace(`Expectations will be set with promises concurrency: ${concurrency}`);

    for (const path of allPaths) {
      const fullPath = resolve(path);

      log.trace(`Setting expectations from file: ${fullPath}`);

      const expectations: Expectation[] = await readJsonFile(fullPath);

      queue.add(() => setExpectations(client, expectations));
    }
  } catch (error: any) {
    log.error(error.message);
    throw error;
  }
}
