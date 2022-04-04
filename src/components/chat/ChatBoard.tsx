import { memo, useRef } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  selectTargetChatRoom,
  chatType,
} from "../../redux/message/messageSlice";
import {
  selectTargetFriend,
  selectTargetGroup,
} from "../../redux/user/userSlice";

import MessageInput from "./MessageInput";
import ImageInput from "./ImageInput";
import SelectFriendForGroup from "../group/SelectFriendForGroup";
import SelectGroupForFriend from "../group/SelectGroupForFriend";

// UI //
import styles from "./ChatBoard.module.css";
import { Slide } from "@mui/material";
import ChatLogs from "./ChatLogs";
import MembersList from "../group/MembersList";

interface Props {
  socket: Socket | undefined;
  openMemberList: boolean;
  openFriendForGroup: boolean;
  openGroupForFriend: boolean;
  setOpenMemberList: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenFriendForGroup: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenGroupForFriend: React.Dispatch<React.SetStateAction<boolean>>;
}

function ChatBoard({
  socket,
  openMemberList,
  openFriendForGroup,
  openGroupForFriend,
  setOpenMemberList,
  setOpenFriendForGroup,
  setOpenGroupForFriend,
}: Props): JSX.Element {
  const targetChatRoom = useSelector(selectTargetChatRoom);
  const targetGroup = useSelector(selectTargetGroup(targetChatRoom.id));
  const targetFriend = useSelector(selectTargetFriend(targetChatRoom.id));

  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <main className={styles.main} id="drawer-container" ref={containerRef}>
      <div className={styles.chat_logs}>
        <ChatLogs />
      </div>

      <div className={styles.input_container}>
        <MessageInput socket={socket} />
        <ImageInput socket={socket} />
      </div>

      {targetChatRoom.type === chatType.group && (
        <>
          <Slide
            id="custom_scroll_3"
            direction="left"
            in={openMemberList}
            container={containerRef.current}
          >
            <div className={styles.slide_1st}>
              <MembersList
                socket={socket}
                setOpenMemberList={setOpenMemberList}
              />
            </div>
          </Slide>
          <Slide
            id="custom_scroll_3"
            direction="left"
            in={openFriendForGroup}
            container={containerRef.current}
          >
            <div className={styles.slide_2nd}>
              <SelectFriendForGroup
                socket={socket}
                group_id={targetGroup.group_id}
                group_name={targetGroup.group_name}
                admin_user_id={targetGroup.admin_user_id}
                setOpenFriendForGroup={setOpenFriendForGroup}
              />
            </div>
          </Slide>
        </>
      )}

      {targetChatRoom.type === chatType.private && (
        <Slide
          id="custom_scroll_3"
          direction="left"
          in={openGroupForFriend}
          container={containerRef.current}
        >
          <div className={styles.slide_1st}>
            <SelectGroupForFriend
              socket={socket}
              friend_id={targetFriend.friend_id}
            />
          </div>
        </Slide>
      )}
    </main>
  );
}

export default memo(ChatBoard);

/**<Drawer
              anchor="right"
              variant="persistent"
              open={true}
              // onClose={toggleDrawer(anchor, false)}
              ModalProps={{
    container: document.getElementById('drawer-container'),
    style: { position: 'absolute' }
  }}
            >
              <div style={{ width: "200px" }}>the drawer</div>
            </Drawer> */
