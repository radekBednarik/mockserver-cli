import { mockServerClient } from "mockserver-client";
import type { MockServerClient, PathOrRequestDefinition, ClearType } from "mockserver-client/mockServerClient.js";
import type { Expectation } from "mockserver-client/index.js";

export default class Client {
  private client: MockServerClient;
  private readonly proto: "http" | "https";
  private readonly host: string;
  private readonly port: number;

  constructor({ proto, host, port }: { proto: "http" | "https"; host: string; port: number }) {
    this.proto = proto;
    this.host = host;
    this.port = port;

    this.client = mockServerClient(`${this.proto}://${this.host}`, this.port);
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
