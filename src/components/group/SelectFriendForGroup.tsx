import { Avatar, Popover } from "@mui/material";
import { ChangeEvent, memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  selectFriendsList,
  selectResult_groupInvitation,
  selectUserId,
  selectUsername,
  setResult_groupInvitation,
} from "../../redux/user/userSlice";
import { groupInvitationRequest_emitter } from "../../socket-io/emitters";

// UI //
import styles from "./MembersList.module.css";
import styles_2 from "../group/CreateGroup.module.css";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";

interface Props {
  socket: Socket | undefined;
  group_id: string;
  group_name: string;
  admin_user_id: string;
  setOpenFriendForGroup: React.Dispatch<React.SetStateAction<boolean>>;
}

function InviteFriendToGroup({
  socket,
  group_id,
  group_name,
  admin_user_id,
  setOpenFriendForGroup,
}: Props): JSX.Element {
  const dispatch = useDispatch();

  const friendsList = useSelector(selectFriendsList);
  const result_invitation = useSelector(selectResult_groupInvitation);

  function handleClose() {
    setOpenFriendForGroup(false);
  }

  function invitationHandler(friend_id: string) {
    if (socket) {
      groupInvitationRequest_emitter(socket, {
        friend_id,
        group_id,
        group_name,
        admin_user_id,
      });
    }
    setTimeout(() => {
      dispatch(setResult_groupInvitation(""));
    }, 20000);
  }

  return (
    <>
      <div className={styles.close_icon_wrapper}>
        <CancelPresentationIcon
          className={styles.close_icon}
          onClick={handleClose}
        />
      </div>
      <main className={styles.main}>
        <div className={styles.group_name_wrapper}>
          <div id="main_title_2">Invite Friends to the Group</div>
          <div className={styles_2.border}></div>
        </div>

        <div className={styles.list}>
          <div className={styles.sub_title}>Friends</div>
          <div className={styles.short_border}></div>
          <div className={styles.list_body}>
            {Object.values(friendsList).map((friend) => {
              const { friend_id, avatar_url, friend_username } = friend;

              return (
                <div
                  key={friend_id}
                  className={styles.member_wrapper}
                  onClick={() => invitationHandler(friend.friend_id)}
                >
                  <Avatar
                    src={avatar_url ? avatar_url : friend_username[0]}
                    alt={friend_username[0]}
                    className={styles.avatar}
                  />
                  <div className={styles.username}>{friend_username}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.inv_result}>{result_invitation}</div>
      </main>{" "}
    </>
  );
}

export default memo(InviteFriendToGroup);
