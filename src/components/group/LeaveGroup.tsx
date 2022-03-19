import { ChangeEvent, memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  addNewMessageToHistory_memory,
  selectTargetChatRoom,
} from "../../redux/message/messageSlice";
import {
  leaveGroup,
  selectUserId,
  selectUsername,
} from "../../redux/user/userSlice";
import { leaveGroup_emitter } from "../../socket-io/emitters";

interface Props {
  socket: Socket | undefined;
  group_id: string;
  group_name: string;
  admin_user_id: string;
}

function LeaveGroup({
  socket,
  group_id,
  group_name,
  admin_user_id,
}: Props): JSX.Element {
  const dispatch = useDispatch();

  const currentUserId = useSelector(selectUserId);
  const currentUsername = useSelector(selectUsername);
  const targetChatRoom = useSelector(selectTargetChatRoom);

  function leaveGroupHandler() {
    if (socket)
      leaveGroup_emitter(socket, {
        group_id,
        user_id: currentUserId,
        admin_user_id,
      });

    dispatch(leaveGroup({ group_id, was_kicked: false }));

    // add the notification msg for the user who just left the group
    let msg_body = `Member ${currentUsername} has left the group...`;
    dispatch(
      addNewMessageToHistory_memory({
        messageObject: {
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
        },
        room_type: targetChatRoom.type,
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
