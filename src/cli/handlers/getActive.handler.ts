import Client from "../../client/client.js";
import { logger } from "../../log/logger.js";
import { getAllFilePaths, readJsonFile } from "../../io/io.js";
import { globalOptsHandler } from "./globalOpts.handler.js";
import PQueue from "p-queue";
import { resolve } from "path";
import type { OptionValues } from "commander";
import type { PathOrRequestDefinition } from "mockserver-client/mockServerClient.js";
import { Expectation } from "mockserver-client";

const log = logger.child({ module: "get-active" });

async function getActiveExpectation(client: Client, expectations: PathOrRequestDefinition) {
  try {
    const response = await client.getActiveExpectations(expectations);

    return response;
  } catch (error: any) {
    log.error("Error getting active expectations:", error);
    return null;
  }
}

export async function getActiveHandler(paths: string[], options: OptionValues) {
  try {
    log.trace(`Handling get-active command with args: ${JSON.stringify({ paths, options })}`);

    const opts = await globalOptsHandler(options);
    const concurrency = parseInt(opts["concurrency"]);

    const allPaths: string[] = [];

    for (const path of paths) {
      const expectationsPaths = await getAllFilePaths(path);
      allPaths.push(...expectationsPaths);
    }

    log.trace(`All expectations filepaths resolved to: ${JSON.stringify(allPaths)}`);

    const client = new Client({
      proto: opts["config"].proto,
      host: opts["config"].host,
      port: opts["config"].port,
    });

    const activeExpectations: Expectation[] = [];
    const queue = new PQueue({ concurrency });

    queue.on("completed", (result) => {
      log.trace(`Retrieved active expectation: ${JSON.stringify(result)}`);
      activeExpectations.push(result);
    });

    log.trace(`Expectations will be set with promises concurrency: ${concurrency}`);

    for (const path of allPaths) {
      const fullPath = resolve(path);

      log.trace(`Getting active expectations from file: ${fullPath}`);

      const expectations: Expectation[] = await readJsonFile(fullPath);

      for (const expectation of expectations) {
        queue.add(() => getActiveExpectation(client, expectation));
      }
    }

    await queue.onIdle();

    return activeExpectations;
  } catch (error: any) {
    log.error(error.message);
    throw error;
  }
}
