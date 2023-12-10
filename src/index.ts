import { program } from "./cli/cli.js";
import { logger } from "./log/logger.js";

const log = logger.child({ module: "index" });

(async () => {
  try {
    await program.parseAsync(process.argv);
  } catch (error: any) {
    log.fatal(error);
    process.exit(1);
  }
})();
