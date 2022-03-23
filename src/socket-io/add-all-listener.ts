import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import {
  addFriendRequest_listener,
  addFriendResponse_listener,
  blockFriend_listener,
  check_addFriendRequest_listener,
  check_groupInvitation_listener,
  groupAdminNotification_listener,
  groupInvitationRequest_listener,
  kickedOutOfGroup_listener,
  message_listener,
  offline_listener,
  onlineEcho_listener,
  online_listener,
} from "./listeners";

export default function addAllListeners(
  socket: Socket,
  dispatch: Dispatch,
  currentUserId: string
): void {
  // user
  message_listener(socket, dispatch);
  online_listener(socket, dispatch);
  onlineEcho_listener(socket, dispatch);
  offline_listener(socket, dispatch);

  // friends
  addFriendRequest_listener(socket, dispatch);
  addFriendResponse_listener(socket, dispatch, currentUserId);
  blockFriend_listener(socket, dispatch);
  check_addFriendRequest_listener(socket, dispatch);

  // groups
  check_groupInvitation_listener(socket, dispatch);
  groupAdminNotification_listener(socket, dispatch);
  groupInvitationRequest_listener(socket, dispatch);
  kickedOutOfGroup_listener(socket, dispatch);
}
