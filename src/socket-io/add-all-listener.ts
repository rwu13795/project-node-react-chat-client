import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
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

export default function addAllListeners(
  socket: Socket,
  dispatch: Dispatch,
  data: {
    user_id: string;
    group_ids: string[];
  }
): void {
  const { user_id, group_ids } = data;

  // each user will join his/her private room and all the groups room after signing in
  joinRoom_emitter(socket, {
    user_id,
    group_ids,
  });

  // user
  message_listener(socket, dispatch);
  online_listener(socket, dispatch);
  onlineEcho_listener(socket, dispatch);
  offline_listener(socket, dispatch);
  disconnectSameUser_listener(socket, dispatch);

  // friends
  addFriendRequest_listener(socket, dispatch);
  addFriendResponse_listener(socket, dispatch, user_id);
  blockFriend_listener(socket, dispatch);
  check_addFriendRequest_listener(socket, dispatch);
  newFriendAdded_listener(socket, dispatch, user_id);
  changeUsername_listener(socket, dispatch);
  changeAvatar_listener(socket, dispatch);

  // groups
  check_groupInvitation_listener(socket, dispatch);
  groupAdminNotification_listener(socket, dispatch);
  groupInvitationRequest_listener(socket, dispatch);
  kickedOutOfGroup_listener(socket, dispatch);
  joinNewGroup_listener(socket, dispatch);
}
