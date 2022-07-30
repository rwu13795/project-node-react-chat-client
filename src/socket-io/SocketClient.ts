import { io, Socket } from "socket.io-client";
import { Dispatch } from "@reduxjs/toolkit";

import { joinRoom_emitter } from "./emitters";
import {
  addFriendRequest_listener,
  addFriendResponse_listener,
  blockFriend_listener,
  changeAvatar_listener,
  changeUsername_listener,
  check_addFriendRequest_listener,
  check_groupInvitation_listener,
  disconnectSameUser_listener,
  groupAdminNotification_listener,
  groupInvitationRequest_listener,
  joinNewGroup_listener,
  kickedOutOfGroup_listener,
  message_listener,
  newFriendAdded_listener,
  offline_listener,
  onlineEcho_listener,
  online_listener,
} from "./listeners";

export default class SocketClient {
  private static client: SocketClient = new SocketClient();
  private socket: Socket | null = null;
  private listenersAdded: boolean = false;

  private constructor() {}

  public static getClient() {
    if (!SocketClient.client) {
      return this.client;
    }
    return this.client;
  }

  public connect(user_id: string, username: string) {
    if (this.socket) {
      this.socket.disconnect();
    }
    const socket = io(process.env.REACT_APP_SERVER_URL!, {
      // use the "handshake" to let server to identify the current user
      query: { user_id, username },
    });
    this.socket = socket;

    return this.socket;
  }

  public addAllListeners(
    dispatch: Dispatch,
    data: {
      user_id: string;
      group_ids: string[];
    }
  ): void {
    if (this.listenersAdded || !this.socket) {
      return;
    }

    const { user_id, group_ids } = data;

    // each user will join his/her private room and all the groups room after signing in
    joinRoom_emitter(this.socket, {
      user_id,
      group_ids,
    });

    // user
    message_listener(this.socket, dispatch);
    online_listener(this.socket, dispatch);
    onlineEcho_listener(this.socket, dispatch);
    offline_listener(this.socket, dispatch);
    disconnectSameUser_listener(this.socket, dispatch);

    // friends
    addFriendRequest_listener(this.socket, dispatch);
    addFriendResponse_listener(this.socket, dispatch, user_id);
    blockFriend_listener(this.socket, dispatch);
    check_addFriendRequest_listener(this.socket, dispatch);
    newFriendAdded_listener(this.socket, dispatch, user_id);
    changeUsername_listener(this.socket, dispatch);
    changeAvatar_listener(this.socket, dispatch);

    // groups
    check_groupInvitation_listener(this.socket, dispatch);
    groupAdminNotification_listener(this.socket, dispatch);
    groupInvitationRequest_listener(this.socket, dispatch);
    kickedOutOfGroup_listener(this.socket, dispatch);
    joinNewGroup_listener(this.socket, dispatch);

    this.listenersAdded = true;
  }
}
