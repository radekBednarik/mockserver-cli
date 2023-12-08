import { createCommand } from "commander";

export const program = createCommand();

program
  .version("0.0.1")
  .option("-c, --config <path>", "set config path. defaults to './mockserver.config.json'", "./mockserver.config.json")
  .option("--concurrency <number>", "set number of concurrent requests. defaults to '10'", "10");

program
  .command("set")
  .description("send prepared expectations up to the mockserver instance")
  .argument("<paths...>", "paths to the expectations files or dirs")
  .action((paths) => {
    // debug
    console.log("set", paths, program.optsWithGlobals());
  });

program
  .command("clear")
  .description("clear all expectations from the mockserver instance")
  .argument("<paths...>", "paths to the expectations files or dirs");

program.command("reset").description("resets everything in the running mockserver instance");
