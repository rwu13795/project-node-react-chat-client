import { ChangeEvent, memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  addNewMessageToHistory_memory,
  selectTargetChatRoom,
} from "../../redux/message/messageSlice";
import {
  leaveGroup,
  selectUserId,
  selectUsername,
} from "../../redux/user/userSlice";
import { leaveGroup_emitter } from "../../socket-io/emitters";

// UI //
import styles from "./LeaveGroup.module.css";
import styles_2 from "../menu/left/GroupsList.module.css";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { Backdrop, Box, Button, Fade, Modal } from "@mui/material";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";

interface Props {
  socket: Socket | undefined;
  group_id: string;
  group_name: string;
  admin_user_id: string;
  isSmall?: boolean;
  closePopover?: () => void;
}

function LeaveGroup({
  socket,
  group_id,
  admin_user_id,
  isSmall,
  closePopover,
}: Props): JSX.Element {
  const dispatch = useDispatch();

  const currentUserId = useSelector(selectUserId);
  const currentUsername = useSelector(selectUsername);
  const targetChatRoom = useSelector(selectTargetChatRoom);

  const [openModal, setOpenModal] = useState<boolean>(false);

  function handleOpenModal() {
    setOpenModal(true);
  }
  function handleCloseModal() {
    setOpenModal(false);
    if (closePopover) closePopover();
  }

  function leaveGroupHandler() {
    if (socket)
      leaveGroup_emitter(socket, {
        group_id,
        user_id: currentUserId,
        admin_user_id,
      });

    dispatch(leaveGroup({ group_id, was_kicked: false }));

    // add the notification msg for the user who just left the group
    let msg_body = `Member ${currentUsername} has left the group...`;
    dispatch(
      addNewMessageToHistory_memory({
        messageObject: {
          sender_id: currentUserId,
          sender_name: currentUsername,
          recipient_id: group_id,
          recipient_name: "",
          msg_body,
          msg_type: "admin",
          created_at: new Date().toString(),
          file_type: "none",
          file_name: "none",
          file_url: "none",
        },
        room_type: targetChatRoom.type,
      })
    );

    if (closePopover) closePopover();
  }

  return (
    <>
      {isSmall ? (
        <div onClick={handleOpenModal} className={styles.button_wrapper}>
          <PersonRemoveIcon /> Leave Group
        </div>
      ) : (
        <PersonRemoveIcon
          onClick={handleOpenModal}
          sx={{ width: "32px", height: "32px" }}
        />
      )}

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
          <Box className={styles_2.modal}>
            <div className={styles_2.close_icon_wrapper}>
              <CancelPresentationIcon
                className={styles_2.close_icon}
                onClick={handleCloseModal}
              />
            </div>
            <div className={styles.main}>
              <div className={styles.text}>
                Are you sure you want to leave this group? You will no longer be
                able to receive any message from this group, but you can still
                access the chat history.
              </div>
              <div className={styles.buttons_wrapper}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={leaveGroupHandler}
                  className={styles.button}
                >
                  Leave
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleCloseModal}
                  className={styles.button}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

export default memo(LeaveGroup);
