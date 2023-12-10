import { pino } from "pino";

const transports = pino.transport({
  targets: [
    {
      level: process.env["LOG_LEVEL"] ? process.env["LOG_LEVEL"] : "info",
      target: "pino-pretty",
    },
  ],
});

export const logger = pino(
  {
    name: "mockserver-client",
    level: process.env["LOG_LEVEL"] ? process.env["LOG_LEVEL"] : "info",
    enabled: process.env["LOG_ENABLED"] === "false" ? false : true,
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
  },
  transports,
);
