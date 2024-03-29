import { memo, useEffect } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import { selectTargetGroup } from "../../../redux/user/userSlice";
import LeaveGroup from "../../group/LeaveGroup";
import RemoveGroup from "../../group/RemoveGroup";
import OptionsGroupChatMenu from "./OptionsGroupChatMenu";
import MembersListAvatars from "../../group/MembersListAvatars";
import { scrollMainPage } from "../../../utils";

// UI //
import styles from "./GroupChatMenu.module.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { Tooltip, useMediaQuery } from "@mui/material";

interface Props {
  target_id: string;
  socket: Socket | undefined;
  setOpenMemberList: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenFriendForGroup: React.Dispatch<React.SetStateAction<boolean>>;
  homePageMainGridRef: React.MutableRefObject<HTMLDivElement | null>;
}

function GroupChatMenu({
  target_id,
  socket,
  setOpenMemberList,
  setOpenFriendForGroup,
  homePageMainGridRef,
}: Props): JSX.Element {
  const isSmall = useMediaQuery("(max-width:765px)");
  const max_900px = useMediaQuery("(max-width:900px)");

  const {
    group_id,
    group_name,
    admin_user_id,
    user_left_at,
    was_kicked,
    user_left,
    group_members,
  } = useSelector(selectTargetGroup(target_id));

  useEffect(() => {
    setOpenFriendForGroup(false);
    setOpenMemberList(false);
  }, []);

  function openMembersListHandler() {
    setOpenMemberList((prev) => !prev);
    setOpenFriendForGroup(false);
  }

  function openFriendForGroupHandler() {
    setOpenFriendForGroup((prev) => !prev);
    setOpenMemberList(false);
  }

  function goBackHandler() {
    scrollMainPage(homePageMainGridRef, "left");
  }

  return (
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
        <div className={styles.center_upper}>{group_name}</div>
        <div className={styles.center_boreder}></div>
        {user_left_at && (
          <div className={styles.center_lower}>
            You {was_kicked ? "were kicked out from" : "have left"} this group
            on {new Date(user_left_at).toLocaleDateString()}
          </div>
        )}
      </div>
      <div className={styles.right}>
        {user_left ? (
          <div className={styles.icon_wrapper}>
            <RemoveGroup homePageMainGridRef={homePageMainGridRef} />
          </div>
        ) : max_900px ? (
          <OptionsGroupChatMenu
            socket={socket}
            group_id={group_id}
            group_name={group_name}
            admin_user_id={admin_user_id}
            openMembersListHandler={openMembersListHandler}
            openFriendForGroupHandler={openFriendForGroupHandler}
          />
        ) : (
          <>
            <Tooltip title="Group Info">
              <div
                className={styles.group_info}
                onClick={openMembersListHandler}
              >
                <MembersListAvatars
                  group_members={group_members}
                  user_left={user_left}
                />
              </div>
            </Tooltip>

            <Tooltip title="Invite Friends">
              <div
                className={styles.icon_wrapper}
                onClick={openFriendForGroupHandler}
              >
                <GroupAddIcon className={styles.invite_friends} />
              </div>
            </Tooltip>
            <Tooltip title="Leave Group">
              <div className={styles.icon_wrapper}>
                <LeaveGroup
                  socket={socket}
                  group_id={group_id}
                  group_name={group_name}
                  admin_user_id={admin_user_id}
                />
              </div>
            </Tooltip>
          </>
        )}
      </div>
    </main>
  );
}

export default memo(GroupChatMenu);
