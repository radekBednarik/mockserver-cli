import type { OptionValues } from "commander";
import Client from "../../client/client.js";
import { logger } from "../../log/logger.js";
import { globalOptsHandler } from "./globalOpts.handler.js";
import { SuccessFullRequest } from "mockserver-client/mockServerClient.js";

const log = logger.child({ module: "resetHandler" });

export async function resetHandler(options: OptionValues) {
  try {
    log.trace(`Handling reset command.`);

    const opts = await globalOptsHandler(options);

    const client = new Client({
      proto: opts["config"]["proto"],
      host: opts["config"]["host"],
      port: opts["config"]["port"],
    });

    const response = (await client.reset()) as SuccessFullRequest;

    log.trace("Mockserver reset handler done.");

    return response;
  } catch (error: any) {
    log.error(error.message);
    return null;
  }
}
