import { program } from "./cli/cli.js";
import { logger } from "./log/logger.js";

const log = logger.child({ module: "index" });

(async () => {
  try {
    log.trace("Starting program");

    await program.parseAsync(process.argv);

    log.trace("Program finished");
  } catch (error: any) {
    log.fatal(error);
    process.exit(1);
  }
})();
