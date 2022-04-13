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
  setOpenFriendForGroup: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenGroupForFriend: React.Dispatch<React.SetStateAction<boolean>>;
  homePageMainGridRef: React.MutableRefObject<HTMLDivElement | null>;
}

function ChatRoomMenu({
  socket,
  setOpenMemberList,
  setOpenFriendForGroup,
  setOpenGroupForFriend,
  homePageMainGridRef,
}: Props): JSX.Element {
  const targetChatRoom = useSelector(selectTargetChatRoom);

  return (
    <main className={styles.chat_menu}>
      {targetChatRoom.type === chatType.group && (
        <GroupChatMenu
          target_id={targetChatRoom.id}
          socket={socket}
          setOpenMemberList={setOpenMemberList}
          setOpenFriendForGroup={setOpenFriendForGroup}
          homePageMainGridRef={homePageMainGridRef}
        />
      )}
      {targetChatRoom.type === chatType.private && (
        <PrivateChatMenu
          friend_id={targetChatRoom.id}
          socket={socket}
          setOpenGroupForFriend={setOpenGroupForFriend}
          homePageMainGridRef={homePageMainGridRef}
        />
      )}
    </main>
  );
}

export default memo(ChatRoomMenu);
