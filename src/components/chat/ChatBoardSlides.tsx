import { chatType, TargetChatRoom } from "../../redux/message/messageSlice";
import MembersList from "../group/MembersList";

// UI //
import styles from "./ChatBoardSlides.module.css";
import { Slide } from "@mui/material";
import SelectFriendForGroup from "../group/SelectFriendForGroup";
import SelectGroupForFriend from "../group/SelectGroupForFriend";
import { Friend, Group } from "../../redux/user/userSlice";
import { Socket } from "socket.io-client";
import { memo } from "react";

interface Props {
  socket: Socket | undefined;
  targetGroup: Group;
  targetFriend: Friend;
  targetChatRoom: TargetChatRoom;
  slideAnchorRef: React.MutableRefObject<HTMLDivElement | null>;
  openMemberList: boolean;
  openFriendForGroup: boolean;
  openGroupForFriend: boolean;
  setOpenMemberList: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenFriendForGroup: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenGroupForFriend: React.Dispatch<React.SetStateAction<boolean>>;
}

function ChatBoardSlides({
  socket,
  targetGroup,
  targetFriend,
  targetChatRoom,
  slideAnchorRef,
  openMemberList,
  openFriendForGroup,
  openGroupForFriend,
  setOpenMemberList,
  setOpenFriendForGroup,
  setOpenGroupForFriend,
}: Props): JSX.Element {
  return (
    <>
      {targetChatRoom.type === chatType.group && (
        <>
          <Slide
            id="custom_scroll_3"
            direction="left"
            in={openMemberList}
            container={slideAnchorRef.current}
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
            container={slideAnchorRef.current}
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
          container={slideAnchorRef.current}
        >
          <div className={styles.slide_1st}>
            <SelectGroupForFriend
              socket={socket}
              friend_id={targetFriend.friend_id}
              setOpenGroupForFriend={setOpenGroupForFriend}
            />
          </div>
        </Slide>
      )}
    </>
  );
}

export default memo(ChatBoardSlides);
