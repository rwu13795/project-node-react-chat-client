import { memo, useState } from "react";
import { Socket } from "socket.io-client";

import ChatBoard from "../../chat/ChatBoard";
import ChatRoomMenu from "./ChatRoomMenu";

// UI //
import styles from "./ChatRoom.module.css";
import { useSelector } from "react-redux";
import { selectTargetChatRoom } from "../../../redux/message/messageSlice";

interface Props {
  socket: Socket | undefined;
}

function ChatRoom({ socket }: Props): JSX.Element {
  const targetChatRoom = useSelector(selectTargetChatRoom);

  const [openMemberList, setOpenMemberList] = useState<boolean>(false);
  const [openFriendsForGroup, setOpenFriendsForGroup] =
    useState<boolean>(false);
  const [openGroupsForFriend, setGroupsForFriend] = useState<boolean>(false);

  return targetChatRoom.id ? (
    <main className={styles.main}>
      <ChatRoomMenu
        socket={socket}
        setOpenMemberList={setOpenMemberList}
        setOpenFriendsForGroup={setOpenFriendsForGroup}
        setOpenGroupsForFriend={setGroupsForFriend}
      />
      <ChatBoard
        socket={socket}
        openMemberList={openMemberList}
        openFriendsForGroup={openFriendsForGroup}
        openGroupsForFriend={openGroupsForFriend}
      />
    </main>
  ) : (
    <main className={styles.no_target}></main>
  );
}

export default memo(ChatRoom);
