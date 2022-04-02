import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  selectLoadingStatus_msg,
  setLoadingStatus_msg,
} from "../../redux/message/messageSlice";
import {
  GroupInvitation as GroupInvitation_type,
  deleteGroupInvitation,
  selectFriendsList,
  selectLoadingStatus_user,
  setLoadingStatus_user,
} from "../../redux/user/userSlice";
import { groupInvitationResponse_emitter } from "../../socket-io/emitters";
import { AvatarOptions, loadingStatusEnum } from "../../utils";
import UserAvatar from "../menu/top/UserAvatar";

// UI //
import styles from "./GroupInvitation.module.css";
import styles_2 from "../menu/left/RenderGroup.module.css";
import { Backdrop, Badge, Box, Button, Fade, Modal } from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import GroupIcon from "@mui/icons-material/Group";
import CircularProgress from "@mui/material/CircularProgress";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";

interface Props {
  groupInvitations: GroupInvitation_type[];
  socket: Socket | undefined;
}

function GroupInvitation({ groupInvitations, socket }: Props): JSX.Element {
  const dispatch = useDispatch();

  const loadingStatus = useSelector(selectLoadingStatus_user);
  const friendsList = useSelector(selectFriendsList);

  const [openModal, setOpenModal] = useState<boolean>(false);

  function handleOpenModal() {
    setOpenModal(true);
  }
  function handleCloseModal() {
    setOpenModal(false);
  }

  function responseHandler(group_id: string, accept: boolean) {
    if (accept) {
      dispatch(
        setLoadingStatus_user(loadingStatusEnum.joiningNewGroup_loading)
      );
    } else {
      dispatch(deleteGroupInvitation(group_id));
    }
    if (socket) {
      // update the groups and users_in_groups according to the response
      groupInvitationResponse_emitter(socket, { group_id, accept });
    }
  }

  useEffect(() => {
    if (groupInvitations.length < 1) {
      handleOpenModal();
    }
  }, [groupInvitations]);

  return (
    <main className={styles.main}>
      <Button className={styles_2.button} onClick={handleOpenModal}>
        <GroupAddIcon sx={{ zIndex: 2 }} />
        <div className={styles_2.button_text}>Group Invitations</div>
        <Badge
          badgeContent={groupInvitations.length}
          color="primary"
          className={styles_2.badge}
        />
      </Button>
      <div className={styles.bottom_border}></div>

      <Modal
        disableScrollLock={true}
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <Box className={styles.modal}>
            <div className={styles.close_icon_wrapper}>
              <CancelPresentationIcon
                className={styles.close_icon}
                onClick={handleCloseModal}
              />
            </div>

            <div className={styles.title}>Group Invitaions</div>
            <div className={styles.border}></div>
            {groupInvitations.map((inv, index) => {
              const { group_id, group_name, inviter_id } = inv;
              const { friend_username, avatar_url } = friendsList[inviter_id];
              return (
                <div key={group_id} className={styles.invitation_wrapper}>
                  <div className={styles.invitation}>
                    <div className={styles.username}>
                      <div className={styles.avatar_wrapper}>
                        <UserAvatar
                          socket={undefined}
                          username={friend_username}
                          avatar_url={avatar_url}
                          option={AvatarOptions.topAvatar}
                        />
                      </div>
                      <div>{friend_username}</div>
                    </div>
                    <div className={styles.inv_text}>invites you to</div>
                    <div className={styles.group_name}>
                      <GroupIcon />
                      {group_name}
                    </div>
                  </div>
                  <div className={styles.buttons_wrapper}>
                    <Button
                      variant="outlined"
                      onClick={() => responseHandler(group_id, true)}
                      className={styles.button}
                      disabled={
                        loadingStatus ===
                        loadingStatusEnum.joiningNewGroup_loading
                      }
                    >
                      accpet
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => responseHandler(group_id, false)}
                      className={styles.button}
                      disabled={
                        loadingStatus ===
                        loadingStatusEnum.joiningNewGroup_loading
                      }
                    >
                      reject
                    </Button>
                  </div>
                </div>
              );
            })}
            {loadingStatus === loadingStatusEnum.joiningNewGroup_loading && (
              <CircularProgress className={styles.loading} />
            )}
          </Box>
        </Fade>
      </Modal>
    </main>
  );
}

export default memo(GroupInvitation);
