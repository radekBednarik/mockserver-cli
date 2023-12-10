import { mockServerClient } from "mockserver-client";
import type { MockServerClient, PathOrRequestDefinition, ClearType } from "mockserver-client/mockServerClient.js";
import type { Expectation } from "mockserver-client/index.js";
import { logger } from "../log/logger.js";

const log = logger.child({ module: "client" });

export default class Client {
  private client: MockServerClient;

  constructor({ proto, host, port }: { proto: "http" | "https"; host: string; port: number }) {
    this.client = this._setupClient({ proto, host, port });
  }

  private _setupClient({ proto, host, port }: { proto: "http" | "https"; host: string; port: number }) {
    try {
      if (host === "localhost") {
        return mockServerClient(`${host}`, port);
      }

      return mockServerClient(`${proto}://${host}`, port);
    } catch (error: any) {
      log.error(error.message);
      throw error;
    }
  }

  public async set(expectations: Expectation | Expectation[]) {
    try {
      return await this.client.mockAnyResponse(expectations);
    } catch (error: any) {
      log.error(error.message);
      throw error;
    }
  }

  public async clear(pathOrRequestDefinition: PathOrRequestDefinition, type: ClearType) {
    try {
      return await this.client.clear(pathOrRequestDefinition, type);
    } catch (error: any) {
      log.error(error.message);
      throw error;
    }
  }

  public async reset() {
    try {
      return await this.client.reset();
    } catch (error: any) {
      log.error(error.message);
      throw error;
    }
  }
}
