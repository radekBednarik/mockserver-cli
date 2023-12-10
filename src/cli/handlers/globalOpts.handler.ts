import type { OptionValues } from "commander";
import { fileExists, readJsonFile } from "../../io/io.js";
import { logger } from "../../log/logger.js";

const log = logger.child({ module: "globalOptsHandler" });

export async function globalOptsHandler(options: OptionValues) {
  try {
    const configPath = options["config"];
    const configExists = fileExists(configPath);

    if (!configExists) {
      throw new Error(`Config file not found at path: ${configPath}`);
    }

    const config = await readJsonFile(configPath);

    return { config: config, concurrency: options["concurrency"] };
  } catch (error: any) {
    log.error(error.message);
    throw error;
  }
}
