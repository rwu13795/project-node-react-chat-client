import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import { joinRoom_emitter, online_emitter } from "./emitters";
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
  data: {
    user_id: string;
    group_ids: string[];
    onlineStatus: string;
  }
): void {
  console.log("setting up listeners");
  const { user_id, group_ids, onlineStatus } = data;

  // each user will join his/her private room and all the groups room after signing in
  joinRoom_emitter(socket, {
    user_id,
    group_ids,
  });
  // let all the friends know this user is online
  online_emitter(socket, { onlineStatus });

  // user
  message_listener(socket, dispatch);
  online_listener(socket, dispatch);
  onlineEcho_listener(socket, dispatch);
  offline_listener(socket, dispatch);

  // friends
  addFriendRequest_listener(socket, dispatch);
  addFriendResponse_listener(socket, dispatch, user_id);
  blockFriend_listener(socket, dispatch);
  check_addFriendRequest_listener(socket, dispatch);

  // groups
  check_groupInvitation_listener(socket, dispatch);
  groupAdminNotification_listener(socket, dispatch);
  groupInvitationRequest_listener(socket, dispatch);
  kickedOutOfGroup_listener(socket, dispatch);
}
