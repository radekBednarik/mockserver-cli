import type { OptionValues } from "commander";
import { fileExists, readJsonFile } from "../../io/io.js";

export async function globalOptsHandler(options: OptionValues) {
  const configPath = options["config"];
  const configExists = fileExists(configPath);

  if (!configExists) {
    throw new Error(`Config file not found at path: ${configPath}`);
  }

  const config = await readJsonFile(configPath);

  return { config: config, concurrency: options["concurrency"] };
}
