import axios, { AxiosInstance } from "axios";

export class AxiosClient {
  private static client: AxiosInstance;

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {}

  public static getClient() {
    if (!AxiosClient.client) {
      AxiosClient.client = axios.create({
        withCredentials: true,
      });
    }

    return AxiosClient.client;
  }
}
