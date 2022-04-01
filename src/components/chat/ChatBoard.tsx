import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  MessageObject,
  selectTargetChatRoom,
  selectTargetChatRoom_history,
  loadMoreOldChatHistory_database,
  chatType,
  selectInfiniteScrollStats,
  setInfiniteScrollStats,
  selectLoadingStatus_msg,
} from "../../redux/message/messageSlice";
import {
  selectTargetFriend,
  selectTargetGroup,
  selectUserId,
  selectUsername,
} from "../../redux/user/userSlice";

import InfiniteScroll from "react-infinite-scroll-component";
import MessageInput from "./MessageInput";
import ImageInput from "./ImageInput";
import { client } from "../../redux/utils";
import { loadingStatusEnum } from "../../utils";

// UI //
import styles from "./ChatBoard.module.css";
import background from "../../images/background.jpg";
import { Drawer, Slide } from "@mui/material";
import ChatLogs from "./ChatLogs";

interface Props {
  socket: Socket | undefined;
  openMemberList: boolean;
  openFriendsForGroup: boolean;
  openGroupsForFriend: boolean;
}

function ChatBoard({
  socket,
  openMemberList,
  openFriendsForGroup,
  openGroupsForFriend,
}: Props): JSX.Element {
  const dispatch = useDispatch();

  const chatHistory = useSelector(selectTargetChatRoom_history);
  const currentUserId = useSelector(selectUserId);
  const currentUsername = useSelector(selectUsername);
  const targetChatRoom = useSelector(selectTargetChatRoom);
  const targetGroup = useSelector(selectTargetGroup(targetChatRoom.id));
  const targetFriend = useSelector(selectTargetFriend(targetChatRoom.id));
  const infiniteScrollStats = useSelector(selectInfiniteScrollStats);
  const loadingStatus = useSelector(selectLoadingStatus_msg);

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
        <Slide
          direction="left"
          in={openMemberList}
          container={containerRef.current}
          style={{
            backgroundColor: "white",
            zIndex: 9,
            position: "relative",
            width: "100%",
            minHeight: "100%",
            border: "solid red 2px",
            bottom: "80%",
          }}
        >
          <div>Member list</div>
        </Slide>
      )}
      {targetChatRoom.type === chatType.group && (
        <Slide
          direction="left"
          in={openFriendsForGroup}
          container={containerRef.current}
        >
          <div
            style={{
              backgroundColor: "white",
              zIndex: 9,
              position: "relative",
              width: "100%",
              height: "100%",
              border: "solid red 2px",
              bottom: "180%",
            }}
          >
            open Friends For Group
          </div>
        </Slide>
      )}
      {targetChatRoom.type === chatType.private && (
        <Slide
          direction="left"
          in={openGroupsForFriend}
          container={containerRef.current}
        >
          <div
            style={{
              backgroundColor: "white",
              zIndex: 9,
              position: "relative",
              width: "100%",
              height: "100%",
              border: "solid red 2px",
              bottom: "101%",
            }}
          >
            open Groups For Friend
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
