import { memo, useState } from "react";
import { Socket } from "socket.io-client";

import ChatBoard from "../../chat/ChatBoard";
import ChatRoomMenu from "./ChatRoomMenu";

// UI //
import styles from "./ChatRoom.module.css";

interface Props {
  socket: Socket | undefined;
}

function ChatRoom({ socket }: Props): JSX.Element {
  const [openMemberList, setOpenMemberList] = useState<boolean>(false);
  const [openFriendsForGroup, setOpenFriendsForGroup] =
    useState<boolean>(false);
  const [openGroupsForFriend, setGroupsForFriend] = useState<boolean>(false);

  return (
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
  );
}

export default memo(ChatRoom);
