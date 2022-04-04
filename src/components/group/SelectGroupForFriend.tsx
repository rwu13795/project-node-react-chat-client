import { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  selectGroupsList,
  selectResult_groupInvitation,
  selectUsername,
  setResult_groupInvitation,
} from "../../redux/user/userSlice";
import { groupInvitationRequest_emitter } from "../../socket-io/emitters";

// UI //
import styles from "./SelectGroupForFriend.module.css";
import styles_2 from "../group/CreateGroup.module.css";
import styles_3 from "./MembersList.module.css";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import GroupIcon from "@mui/icons-material/Group";
import { Button } from "@mui/material";

interface Props {
  socket: Socket | undefined;
  friend_id: string;
  setOpenGroupForFriend: React.Dispatch<React.SetStateAction<boolean>>;
}

function SelectGroupForFriend({
  socket,
  friend_id,
  setOpenGroupForFriend,
}: Props): JSX.Element {
  const dispatch = useDispatch();

  const result_invitation = useSelector(selectResult_groupInvitation);
  const groupsList = useSelector(selectGroupsList);

  function handleClose() {
    setOpenGroupForFriend(false);
  }

  function invitationHandler(
    group_id: string,
    group_name: string,
    admin_user_id: string
  ) {
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
    }, 10000);
  }

  return (
    <>
      <div className={styles_3.close_icon_wrapper}>
        <CancelPresentationIcon
          className={styles_3.close_icon}
          onClick={handleClose}
        />
      </div>
      <main className={styles_3.main}>
        <div className={styles_3.group_name_wrapper}>
          <div id="main_title_2">Invite Friend to a Group</div>
          <div className={styles_2.border}></div>
        </div>

        <div className={styles_3.list}>
          <div className={styles_3.sub_title}>Friends</div>
          <div className={styles_3.short_border}></div>
          <div className={styles_3.list_body}>
            {Object.values(groupsList).map((group) => {
              const { group_id, group_name, admin_user_id } = group;
              return (
                <Button
                  variant="outlined"
                  key={group_id}
                  className={styles.group_wrapper}
                  onClick={() =>
                    invitationHandler(group_id, group_name, admin_user_id)
                  }
                >
                  <GroupIcon />
                  <div className={styles.group_name}>{group_name}</div>
                </Button>
              );
            })}
          </div>
        </div>

        <div className={styles_3.inv_result}>{result_invitation}</div>
      </main>
    </>
  );
}

export default memo(SelectGroupForFriend);
