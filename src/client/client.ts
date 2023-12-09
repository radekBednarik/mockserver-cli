import { mockServerClient } from "mockserver-client";
import type { MockServerClient, PathOrRequestDefinition, ClearType } from "mockserver-client/mockServerClient.js";
import type { Expectation } from "mockserver-client/index.js";

export default class Client {
  private client: MockServerClient;

  constructor({ proto, host, port }: { proto: "http" | "https"; host: string; port: number }) {
    this.client = this._setupClient({ proto, host, port });
  }

  private _setupClient({ proto, host, port }: { proto: "http" | "https"; host: string; port: number }) {
    if (host === "localhost") {
      return mockServerClient(`${host}`, port);
    }

    return mockServerClient(`${proto}://${host}`, port);
  }

  public async set(expectations: Expectation | Expectation[]) {
    return await this.client.mockAnyResponse(expectations);
  }

  public async clear(pathOrRequestDefinition: PathOrRequestDefinition, type: ClearType) {
    return await this.client.clear(pathOrRequestDefinition, type);
  }

  public async reset() {
    return await this.client.reset();
  }
}
