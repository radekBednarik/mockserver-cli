import { program } from "./cli/cli.js";

(async () => {
  await program.parseAsync(process.argv);
})();
