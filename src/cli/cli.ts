import { createCommand } from "commander";

export const program = createCommand();

program
  .version("0.0.1")
  .option("-c, --config <path>", "set config path. defaults to './mockserver.config.json'", "./mockserver.config.json")
  .option("-a, --address <address>", "set server address. defaults to 'http://localhost:5999'", "http://localhost:5999")
  .option("--concurrency <number>", "set number of concurrent requests. defaults to '10'", "10");

program
  .command("set")
  .description("send prepared expectations up to the mockserver instance")
  .argument("<paths...>", "paths to the expectations files or dirs");

program
  .command("clear")
  .description("clear all expectations from the mockserver instance")
  .argument("<paths...>", "paths to the expectations files or dirs");

program.command("reset").description("resets everything in the running mockserver instance");
