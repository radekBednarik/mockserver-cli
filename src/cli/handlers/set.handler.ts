import Client from "../../client/client.js";
import { getAllFilePaths, readJsonFile } from "../../io/io.js";
import { globalOptsHandler } from "./globalOpts.handler.js";
import type { OptionValues } from "commander";
import type { Expectation } from "mockserver-client";
import { resolve } from "path";

async function setExpectations(client: Client, expectations: Expectation | Expectation[]) {
  try {
    await client.set(expectations);
  } catch (error) {
    console.error("Error setting expectations:", error);
    throw error;
  }
}

export async function setHandler(paths: string[], options: OptionValues) {
  const { config } = await globalOptsHandler(options);

  const allPaths: string[] = [];

  for (const path of paths) {
    const expectationsPaths = await getAllFilePaths(path);
    allPaths.push(...expectationsPaths);
  }

  const client = new Client({ proto: config.proto, host: config.host, port: config.port });

  for (const path of allPaths) {
    const fullPath = resolve(path);
    const expectations: Expectation[] = await readJsonFile(fullPath);

    await setExpectations(client, expectations);
  }
}
