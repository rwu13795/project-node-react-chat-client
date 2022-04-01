import { memo, useState } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  chatType,
  selectTargetChatRoom,
} from "../../../redux/message/messageSlice";
import GroupChatMenu from "./GroupChatMenu";
import PrivateChatMenu from "./PrivateChatMenu";

// UI //
import styles from "./ChatRoomMenu.module.css";

interface Props {
  socket: Socket | undefined;
  setOpenMemberList: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenFriendsForGroup: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenGroupsForFriend: React.Dispatch<React.SetStateAction<boolean>>;
}

function ChatRoomMenu({
  socket,
  setOpenMemberList,
  setOpenFriendsForGroup,
  setOpenGroupsForFriend,
}: Props): JSX.Element {
  const targetChatRoom = useSelector(selectTargetChatRoom);

  return (
    <main className={styles.chat_menu}>
      {targetChatRoom.type === chatType.group && (
        <GroupChatMenu
          target_id={targetChatRoom.id}
          socket={socket}
          setOpenMemberList={setOpenMemberList}
          setOpenFriendsForGroup={setOpenFriendsForGroup}
        />
      )}
      {targetChatRoom.type === chatType.private && (
        <PrivateChatMenu
          friend_id={targetChatRoom.id}
          socket={socket}
          setOpenGroupsForFriend={setOpenGroupsForFriend}
        />
      )}
    </main>
  );
}

export default memo(ChatRoomMenu);
