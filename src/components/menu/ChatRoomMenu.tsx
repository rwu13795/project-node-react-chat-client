import { memo, useState } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import {
  chatType,
  selectTargetChatRoom,
} from "../../redux/message/messageSlice";
import DeleteFriend from "../friend/DeleteFriend";
import MembersList from "../group/MembersList";
import RemoveGroup from "../group/RemoveGroup";
import GroupChatMenu from "./GroupChatMenu";
import PrivateChatMenu from "./PrivateChatMenu";

// UI //
import styles from "./__common.module.css";

interface Props {
  socket: Socket | undefined;
}

function ChatRoomMenu({ socket }: Props): JSX.Element {
  const targetChatRoom = useSelector(selectTargetChatRoom);

  return (
    <main>
      {targetChatRoom.type === chatType.group && (
        <GroupChatMenu group_id={targetChatRoom.id} socket={socket} />
      )}
      {targetChatRoom.type === chatType.private && (
        <PrivateChatMenu friend_id={targetChatRoom.id} socket={socket} />
      )}
    </main>
  );
}

export default memo(ChatRoomMenu);
