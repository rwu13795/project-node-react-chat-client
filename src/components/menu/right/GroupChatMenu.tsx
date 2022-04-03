import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import { selectTargetChatRoom } from "../../../redux/message/messageSlice";
import {
  selectResult_groupInvitation,
  selectTargetGroup,
} from "../../../redux/user/userSlice";
import LeaveGroup from "../../group/LeaveGroup";

import MembersList from "../../group/MembersList";
import RemoveGroup from "../../group/RemoveGroup";
import SelectFriendForGroup from "../../group/SelectFriendForGroup";

// UI //
import styles from "./GroupChatMenu.module.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Tooltip, useMediaQuery } from "@mui/material";
import MembersListAvatars from "../../group/MembersListAvatars";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

interface Props {
  target_id: string;
  socket: Socket | undefined;
  setOpenMemberList: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenFriendForGroup: React.Dispatch<React.SetStateAction<boolean>>;
}

function GroupChatMenu({
  target_id,
  socket,
  setOpenMemberList,
  setOpenFriendForGroup,
}: Props): JSX.Element {
  const isSmall = useMediaQuery("(max-width:765px)");

  const targetChatRoom = useSelector(selectTargetChatRoom);
  const {
    group_id,
    group_name,
    admin_user_id,
    user_left_at,
    was_kicked,
    user_left,
    group_members,
  } = useSelector(selectTargetGroup(target_id));
  const result_invitation = useSelector(selectResult_groupInvitation);

  useEffect(() => {
    setOpenFriendForGroup(false);
    setOpenMemberList(false);
  }, [targetChatRoom]);

  function openMembersListHandler() {
    setOpenMemberList((prev) => !prev);
    setOpenFriendForGroup(false);
  }

  function openFriendForGroupHandler() {
    setOpenFriendForGroup((prev) => !prev);
    setOpenMemberList(false);
  }

  return (
    <main className={styles.main}>
      <div className={styles.left}>
        {isSmall && <ArrowBackIosIcon className={styles.back_arrow} />}
      </div>
      <div className={styles.center}>
        <div className={styles.center_upper}>{targetChatRoom.name}</div>
        <div className={styles.center_boreder}></div>
        {user_left_at && (
          <div className={styles.center_lower}>
            You {was_kicked ? "were kicked out from" : "have left"} this group
            on {user_left_at}
          </div>
        )}
      </div>
      <div className={styles.right}>
        {user_left ? (
          <RemoveGroup />
        ) : (
          <>
            <Tooltip title="Group Info">
              <div
                className={styles.group_info}
                onClick={openMembersListHandler}
              >
                <MembersListAvatars group_members={group_members} />
              </div>
            </Tooltip>

            <Tooltip title="Invite Friend">
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
      {result_invitation}
    </main>
  );
}

export default memo(GroupChatMenu);
