import { io, Socket } from "socket.io-client";

export default class SocketClient {
  private static client: Socket;

  private constructor() {}

  public static getClient(user_id: string, username: string) {
    if (!SocketClient.client) {
      const socket = io(process.env.REACT_APP_SERVER_URL!, {
        // use the "handshake" to let server to identify the current user
        query: { user_id, username },
      });
      SocketClient.client = socket;
    }

    return SocketClient.client;
  }
}
