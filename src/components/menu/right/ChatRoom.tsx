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
  homePageMainGridRef: React.MutableRefObject<HTMLDivElement | null>;
}

function ChatRoom({ socket, homePageMainGridRef }: Props): JSX.Element {
  const targetChatRoom = useSelector(selectTargetChatRoom);

  const [openMemberList, setOpenMemberList] = useState<boolean>(false);
  const [openFriendForGroup, setOpenFriendForGroup] = useState<boolean>(false);
  const [openGroupForFriend, setGroupForFriend] = useState<boolean>(false);

  return targetChatRoom.id ? (
    <main className={styles.main}>
      <ChatRoomMenu
        socket={socket}
        setOpenMemberList={setOpenMemberList}
        setOpenFriendForGroup={setOpenFriendForGroup}
        setOpenGroupForFriend={setGroupForFriend}
        homePageMainGridRef={homePageMainGridRef}
      />
      <ChatBoard
        socket={socket}
        openMemberList={openMemberList}
        openFriendForGroup={openFriendForGroup}
        openGroupForFriend={openGroupForFriend}
        setOpenMemberList={setOpenMemberList}
        setOpenFriendForGroup={setOpenFriendForGroup}
        setOpenGroupForFriend={setGroupForFriend}
      />
    </main>
  ) : (
    <main className={styles.no_target}></main>
  );
}

export default memo(ChatRoom);
