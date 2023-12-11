import { mockServerClient } from "mockserver-client";
import type { MockServerClient, PathOrRequestDefinition, ClearType } from "mockserver-client/mockServerClient.js";
import type { Expectation } from "mockserver-client/index.js";
import { logger } from "../log/logger.js";

const log = logger.child({ module: "client" });

export default class Client {
  private client: MockServerClient;

  constructor({ proto, host, port }: { proto: "http" | "https"; host: string; port: number }) {
    log.trace(`Creating instance of the mockserver client with args: ${proto}, ${host}, ${port}`);

    this.client = this._setupClient({ proto, host, port });

    log.trace("Mockserver client instance created");
  }

  private _setupClient({ proto, host, port }: { proto: "http" | "https"; host: string; port: number }) {
    try {
      if (host === "localhost") {
        return mockServerClient(`${host}`, port);
      }

      return mockServerClient(`${proto}://${host}`, port);
    } catch (error: any) {
      log.error("Setting up client prop failed: ", error);
      throw error;
    }
  }

  public async set(expectations: Expectation | Expectation[]) {
    try {
      log.trace(`Setting expectations: ${JSON.stringify(expectations)}`);

      await this.client.mockAnyResponse(expectations);

      log.trace(`Expectations set: ${JSON.stringify(expectations)}`);
    } catch (error: any) {
      log.error(error.message);
      throw error;
    }
  }

  public async clear(pathOrRequestDefinition: PathOrRequestDefinition, type: ClearType) {
    try {
      log.trace(`Clearing expectation: ${JSON.stringify({ pathOrRequestDefinition, type })}`);

      await this.client.clear(pathOrRequestDefinition, type);

      log.trace(`Expectations cleared: ${JSON.stringify({ pathOrRequestDefinition, type })}`);
    } catch (error: any) {
      log.error(error.message);
      throw error;
    }
  }

  public async reset() {
    try {
      log.trace("Resetting mockserver");

      const result = await this.client.reset();

      log.trace("Mockserver reset.");

      return result;
    } catch (error: any) {
      log.error(error.message);
      throw error;
    }
  }
}
