import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import {
  addNewMessageToHistory_memory,
  MessageObject,
} from "../../redux/message/messageSlice";

import { leaveGroup } from "../../redux/user/userSlice";
import { kickedOutOfGroup_emitter } from "../emitters";

interface Props {
  group_id: string;
}

export function kickedOutOfGroup_listener(
  socket: Socket,
  dispatch: Dispatch<any>
) {
  socket.on("kicked-out-of-group", ({ group_id }: Props) => {
    // use socket.leave(room) in the server to disconnect this kicked user from the group
    kickedOutOfGroup_emitter({ socket, group_id });

    dispatch(leaveGroup({ group_id, was_kicked: true }));
  });
}
