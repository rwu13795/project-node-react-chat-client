import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  selectLoadingStatus_msg,
  setLoadingStatus_msg,
} from "../../redux/message/messageSlice";
import {
  GroupInvitation as GroupInvitation_type,
  respondToGroupInvitation,
  selectLoadingStatus_user,
  setLoadingStatus_user,
} from "../../redux/user/userSlice";
import { groupInvitationResponse_emitter } from "../../socket-io/emitters";
import { loadingStatusEnum } from "../../utils";

// UI //
import styles from "./GroupInvitation.module.css";
import { Backdrop, Box, Button, Fade, Modal } from "@mui/material";

interface Props {
  groupInvitations: GroupInvitation_type[];
  socket: Socket | undefined;
}

function GroupInvitation({ groupInvitations, socket }: Props): JSX.Element {
  const dispatch = useDispatch();

  const loadingStatus = useSelector(selectLoadingStatus_user);

  const [openModal, setOpenModal] = useState<boolean>(false);

  function handleOpenModal() {
    setOpenModal(true);
  }
  function handleCloseModal() {
    setOpenModal(false);
  }

  function responseHandler(group_id: string, accept: boolean, index: number) {
    dispatch(respondToGroupInvitation(index));
    if (accept) {
      dispatch(setLoadingStatus_user(loadingStatusEnum.joiningNewGroup));
    }
    if (socket) {
      // update the groups and users_in_groups according to the response
      groupInvitationResponse_emitter(socket, { group_id, accept });
    }
  }

  useEffect(() => {
    if (loadingStatus === loadingStatusEnum.joiningNewGroup) {
      handleOpenModal();
    }
  }, [loadingStatus]);

  return (
    <main className={styles.main}>
      <div className={styles.title}>Group Invitation</div>

      {groupInvitations.map((inv, index) => {
        return (
          !inv.was_responded && (
            <div key={inv.group_id} className={styles.invitation_wrapper}>
              <div>
                Friend "{inv.inviter_name}" invites you to join Group "
                {inv.group_name}"
              </div>
              <div className={styles.buttons_wrapper}>
                <Button
                  variant="outlined"
                  onClick={() => responseHandler(inv.group_id, true, index)}
                  className={styles.button}
                >
                  accpet
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => responseHandler(inv.group_id, false, index)}
                  className={styles.button}
                >
                  reject
                </Button>
              </div>
            </div>
          )
        );
      })}
      <div className={styles.main_border}></div>

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
            <div className={styles.joining}>Joining the new group</div>
          </Box>
        </Fade>
      </Modal>
    </main>
  );
}

export default memo(GroupInvitation);
