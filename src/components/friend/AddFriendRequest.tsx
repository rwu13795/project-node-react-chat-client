import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  clearAddFriendRequests,
  selectAddFriendRequests,
  selectLoadingStatus_user,
  selectUserId,
  selectUsername,
  selectUserOnlineStatus,
  setLoadingStatus_user,
} from "../../redux/user/userSlice";

import { addFriendResponse_emitter } from "../../socket-io/emitters";
import { loadingStatusEnum } from "../../utils";

// UI //
import styles from "./AddFriendRequest.module.css";
import styles_2 from "../menu/left/RenderFriend.module.css";
import styles_3 from "../menu/left/GroupsList.module.css";
import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Backdrop,
  Badge,
  Box,
  Button,
  Fade,
  Modal,
} from "@mui/material";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

interface Props {
  socket: Socket | undefined;
}

function AddFriendRequest({ socket }: Props): JSX.Element {
  const dispatch = useDispatch();

  const currentUserId = useSelector(selectUserId);
  const currentUsername = useSelector(selectUsername);
  const currentOnlineStatus = useSelector(selectUserOnlineStatus);
  const addFriendRequests = useSelector(selectAddFriendRequests);
  const loadingStatus = useSelector(selectLoadingStatus_user);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [reqIndex, setReqIndex] = useState<number>(-1);
  const [reqSenderId, setReqSenderId] = useState<string>("");

  function handleOpenModal() {
    setOpenModal(true);
  }
  function handleCloseModal() {
    setOpenModal(false);
  }

  function responseHandler(
    sender_id: string,
    sender_username: string,
    accept: boolean,
    index: number
  ) {
    if (socket) {
      // update the friends_pair and notificaiton if request is accepted
      dispatch(setLoadingStatus_user(loadingStatusEnum.addFriend_loading));
      addFriendResponse_emitter(socket, {
        sender_id,
        sender_username,
        target_id: currentUserId,
        target_username: currentUsername,
        accept,
      });
    }
    setReqIndex(index);
    setReqSenderId(sender_id);
    if (!accept) {
      dispatch(clearAddFriendRequests(index));
      dispatch(setLoadingStatus_user(loadingStatusEnum.idle));
    }
  }

  useEffect(() => {
    if (loadingStatus === loadingStatusEnum.addFriend_succeeded) {
      dispatch(clearAddFriendRequests(reqIndex));
      dispatch(setLoadingStatus_user(loadingStatusEnum.idle));
    }
  }, [
    loadingStatus,
    dispatch,
    reqIndex,
    reqSenderId,
    socket,
    currentOnlineStatus,
  ]);

  useEffect(() => {
    if (addFriendRequests.length < 1) handleCloseModal();
  }, [addFriendRequests]);

  return (
    <main>
      <div className={styles.main}>
        <Button className={styles_2.button} onClick={handleOpenModal}>
          <PersonAddIcon sx={{ zIndex: 2 }} />
          <div className={styles_2.button_text}>Friend Requests</div>
          <Badge
            badgeContent={addFriendRequests.length}
            color="primary"
            className={styles_2.badge}
          />
        </Button>
      </div>

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
          <Box className={styles.modal} id="custom_scroll_1">
            <div className={styles_3.close_icon_wrapper}>
              <CancelPresentationIcon
                className={styles_3.close_icon}
                onClick={handleCloseModal}
              />
            </div>
            <div className={styles.requests_modal}>
              <div className={styles.title}>Friend Requests</div>
              {addFriendRequests.map((req, index) => {
                const {
                  sender_username,
                  sender_avatar,
                  sender_email,
                  message,
                  sender_id,
                } = req;
                return (
                  <div key={index} className={styles.requests_wrapper}>
                    <div className={styles.border}></div>
                    <div className={styles.avatar_wrapper}>
                      <Avatar
                        className={styles.avatar}
                        src={sender_avatar ? sender_avatar : sender_username[0]}
                        alt={sender_username[0]}
                      />

                      <div className={styles.user_info}>
                        <div className={styles.user_info_sub}>
                          <div>Username:</div>
                          <div>{sender_username}</div>
                        </div>
                        <div className={styles.user_info_sub}>
                          <div>Email:</div>
                          <div>{sender_email}</div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.message_box_wrapper}>
                      <div className={styles.box_tip}></div>
                      <div className={styles.message_box}>{message}</div>
                    </div>
                    <div className={styles.buttons_wrapper}>
                      <LoadingButton
                        className={styles.button_1}
                        variant="outlined"
                        color="primary"
                        disabled={
                          loadingStatus === loadingStatusEnum.addFriend_loading
                        }
                        loading={
                          loadingStatus ===
                            loadingStatusEnum.addFriend_loading &&
                          index === reqIndex
                        }
                        onClick={() =>
                          responseHandler(
                            sender_id,
                            sender_username,
                            true,
                            index
                          )
                        }
                      >
                        Add Friend
                      </LoadingButton>
                      <Button
                        className={styles.button_2}
                        variant="outlined"
                        color="error"
                        disabled={
                          loadingStatus === loadingStatusEnum.addFriend_loading
                        }
                        onClick={() =>
                          responseHandler(
                            sender_id,
                            sender_username,
                            false,
                            index
                          )
                        }
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Box>
        </Fade>
      </Modal>
    </main>
  );
}

export default memo(AddFriendRequest);
