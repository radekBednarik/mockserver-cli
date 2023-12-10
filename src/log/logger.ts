import { pino } from "pino";

const transports = pino.transport({
  targets: [
    {
      level: process.env["LOG_LEVEL"] ? process.env["LOG_LEVEL"] : "info",
      target: "pino-pretty",
    },
  ],
});

export const logger = pino({
  name: "mockserver-cli",
  level: process.env["LOG_LEVEL"] ? process.env["LOG_LEVEL"] : "info",
  prettyPrint: true,
  transport: transports,
  enabled: process.env["LOG_ENABLED"] ? true : false,
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
});
