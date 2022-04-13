import { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Socket } from "socket.io-client";
import { selectTargetFriend } from "../../../redux/user/userSlice";

import BlockUnblockFriend from "../../friend/BlockUnblockFriend";

// UI //
import styles from "./GroupChatMenu.module.css";
import styles_2 from "./PrivateChatMenu.module.css";
import { Avatar, Tooltip, useMediaQuery } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ViewUserProfile from "../../user/profile/ViewUserProfile";
import OptionsPrivateChatMenu from "./OptionsPrivateChatMenu";
import { scrollMainPage } from "../../../utils";

interface Props {
  friend_id: string;
  socket: Socket | undefined;
  setOpenGroupForFriend: React.Dispatch<React.SetStateAction<boolean>>;
  homePageMainGridRef: React.MutableRefObject<HTMLDivElement | null>;
}

function PrivateChatMenu({
  friend_id,
  socket,
  setOpenGroupForFriend,
  homePageMainGridRef,
}: Props): JSX.Element {
  const isSmall = useMediaQuery("(max-width:765px)");
  const max_900px = useMediaQuery("(max-width:900px)");

  const {
    friend_blocked_user,
    friend_blocked_user_at,
    user_blocked_friend,
    user_blocked_friend_at,
    friend_username,
    friend_email,
    avatar_url,
  } = useSelector(selectTargetFriend(friend_id));

  const [openProfile, setOpenProfile] = useState<boolean>(false);

  function openProfileHandler() {
    setOpenProfile(true);
  }
  function closeProfileHandler() {
    setOpenProfile(false);
  }

  function openGroupForFriendHandler() {
    setOpenGroupForFriend((prev) => !prev);
  }
  function goBackHandler() {
    scrollMainPage(homePageMainGridRef, "left");
  }

  useEffect(() => {
    setOpenGroupForFriend(false);
  }, []);

  return (
    <>
      <main className={styles.main}>
        <div className={styles.left}>
          {isSmall && (
            <ArrowBackIosIcon
              className={styles.back_arrow}
              onClick={goBackHandler}
            />
          )}
        </div>
        <div className={styles.center}>
          <div className={styles_2.avatar_wrapper}>
            <Avatar
              src={avatar_url ? avatar_url : friend_username[0]}
              alt={friend_username[0]}
              className={styles_2.avatar}
              onClick={openProfileHandler}
            />
            <div className={styles_2.username}>{friend_username}</div>
          </div>

          {friend_blocked_user && (
            <div className={styles.center_lower}>
              You were blocked by this friend on{" "}
              {new Date(friend_blocked_user_at).toLocaleDateString()}
            </div>
          )}
          {user_blocked_friend && (
            <div className={styles.center_lower}>
              You blocked this friend on{" "}
              {new Date(user_blocked_friend_at).toLocaleDateString()}
            </div>
          )}
        </div>
        <div className={styles.right}>
          {max_900px ? (
            <OptionsPrivateChatMenu
              socket={socket}
              friend_id={friend_id}
              user_blocked_friend={user_blocked_friend}
              openGroupForFriendHandler={openGroupForFriendHandler}
            />
          ) : (
            <>
              <Tooltip title="Invite Friend to Group">
                <div
                  className={styles.icon_wrapper}
                  onClick={openGroupForFriendHandler}
                >
                  <GroupAddIcon className={styles.invite_friends} />
                </div>
              </Tooltip>

              <div className={styles.icon_wrapper}>
                <BlockUnblockFriend
                  friend_id={friend_id}
                  socket={socket}
                  user_blocked_friend={user_blocked_friend}
                />
              </div>
            </>
          )}
        </div>
      </main>
      <ViewUserProfile
        openModal={openProfile}
        user_id={friend_id}
        username={friend_username}
        email={friend_email}
        avatar_url={avatar_url}
        closeModalHandler={closeProfileHandler}
      />
    </>
  );
}

export default memo(PrivateChatMenu);
