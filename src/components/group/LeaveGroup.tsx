import { Popover } from "@mui/material";
import { ChangeEvent, memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import {
  addNewMessageToHistory_memory,
  chatType,
  selectTargetChatRoom,
} from "../../redux/message/messageSlice";
import { createNewGroup } from "../../redux/user/asyncThunk/create-new-group";

import {
  leaveGroup,
  selectCreateGroupError,
  selectFriendsList,
  selectUserId,
  selectUsername,
} from "../../redux/user/userSlice";

interface Props {
  socket: Socket | undefined;
  group_id: string;
  group_name: string;
}

function LeaveGroup({ socket, group_id, group_name }: Props): JSX.Element {
  const dispatch = useDispatch();

  const currentUserId = useSelector(selectUserId);
  const currentUsername = useSelector(selectUsername);
  const targetChatRoom = useSelector(selectTargetChatRoom);

  function leaveGroupHandler() {
    if (socket)
      socket.emit("leave-group", {
        group_id,
        user_id: currentUserId,
      });

    dispatch(leaveGroup({ group_id, was_kicked: false }));

    // add the notification msg for the user who just left the group
    let msg_body = `Member ${currentUsername} has left the group...`;
    dispatch(
      addNewMessageToHistory_memory({
        targetChatRoom_type: chatType.group,
        sender_id: currentUserId,
        sender_name: currentUsername,
        recipient_id: group_id,
        recipient_name: "",
        msg_body,
        msg_type: "admin",
        created_at: new Date().toString(),
        file_type: "none",
        file_name: "none",
        file_url: "none",
      })
    );
  }

  return (
    <main>
      <button onClick={leaveGroupHandler}>leave group</button>
    </main>
  );
}

export default memo(LeaveGroup);
