import { createCommand } from "commander";
import { setHandler } from "./handlers/set.handler.js";

export const program = createCommand();

program
  .version("0.0.1")
  .option("-c, --config <path>", "set config path. defaults to './mockserver.config.json'", "./mockserver.config.json")
  .option("--concurrency <number>", "set number of concurrent requests. defaults to '10'", "10");

program
  .command("set")
  .description("send prepared expectations up to the mockserver instance")
  .argument("<paths...>", "paths to the expectations files or dirs")
  .action(async (paths) => {
    await setHandler(paths, program.optsWithGlobals());
  });

program
  .command("clear")
  .description("clear all expectations from the mockserver instance")
  .argument("<paths...>", "paths to the expectations files or dirs");

program.command("reset").description("resets everything in the running mockserver instance");
