import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";

import {
  selectCurrentUser,
  selectGroupsToJoin,
  selectIsLoggedIn,
} from "../../../redux/user/userSlice";
import ChangeUsername from "./ChangeUsername";
import ChangePW from "./ChangePW";
import AddAvatar from "./AddAvatar";
import connectSocket from "../../../socket-io/socketConnection";
import addAllListeners from "../../../socket-io/add-all-listener";
import { setCurrentUserId_msg } from "../../../redux/message/messageSlice";
import { scrollToTop } from "../../../utils";

// UI //
import styles from "./UserProfile.module.css";
import background_2 from "../../../images/background_2.webp";
import {
  Backdrop,
  Box,
  Button,
  Avatar,
  CircularProgress,
  Fade,
  Modal,
} from "@mui/material";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import EditIcon from "@mui/icons-material/Edit";

interface Props {
  socket: Socket | undefined;
  setSocket: React.Dispatch<React.SetStateAction<Socket | undefined>>;
}

function UserProfile({ socket, setSocket }: Props): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { avatar_url, user_id, username, email, loggedInWithGoogle } =
    useSelector(selectCurrentUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const group_ids = useSelector(selectGroupsToJoin);

  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    if (isLoggedIn === undefined) return;
    if (isLoggedIn === false) {
      navigate("/");
    } else {
      // if getAuth has not finished loading before the selector selected the user_id
      if (!user_id) return;
      if (socket) return;

      dispatch(setCurrentUserId_msg(user_id));
      let newSocket: Socket = connectSocket(user_id, username);
      setSocket(newSocket);
      addAllListeners(newSocket, dispatch, {
        user_id,
        group_ids,
      });
    }
  }, [isLoggedIn, socket, user_id]);

  function handleOpenModal() {
    setOpenModal(true);
  }
  function handleCloseModal() {
    setOpenModal(false);
  }
  function backToHomePage() {
    scrollToTop();
    navigate("/chat");
  }

  return (
    <main className={styles.main} id="main_body">
      {isLoggedIn === undefined ? (
        <CircularProgress />
      ) : (
        <>
          <div className={styles.title} id="main_title">
            User Profile
          </div>
          <div className={styles.upper_body}>
            <div className={styles.upper_left}>
              <div className={styles.avatar_wrapper}>
                {avatar_url ? (
                  <img
                    src={avatar_url}
                    alt={"Missing source"}
                    className={styles.avatar}
                  />
                ) : (
                  <Avatar className={styles.no_avatar} />
                )}
              </div>
              <div className={styles.edit_avatar}>
                <Button
                  variant="contained"
                  color="secondary"
                  className={styles.edit_button}
                  onClick={handleOpenModal}
                >
                  <EditIcon fontSize="small" />
                  Edit
                </Button>
              </div>
            </div>
            <div className={styles.upper_right}>
              <div className={styles.info_text_wrapper}>
                <span className={styles.sub_title}>ID:</span>
                <span>{user_id}</span>
              </div>
              <div className={styles.info_text_border}></div>

              <div className={styles.info_text_wrapper}>
                <span className={styles.sub_title}>Email:</span>
                <span className={styles.info_email}>{email}</span>
              </div>
              <div className={styles.info_text_border}></div>

              <div className={styles.info_text_wrapper}>
                <span className={styles.sub_title}>Username:</span>
                <ChangeUsername username={username} socket={socket} />
              </div>
              <div className={styles.info_text_border}></div>
            </div>
          </div>

          {!loggedInWithGoogle && (
            <>
              <div className={styles.title} id="main_title">
                Change Password
              </div>

              <div className={styles.lower_body}>
                <ChangePW />
              </div>
            </>
          )}

          <img src={background_2} alt="bg" className={styles.img_wrapper} />

          <Button variant="outlined" onClick={backToHomePage}>
            Back to home page
          </Button>

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
                <AddAvatar
                  socket={socket}
                  handleCloseModal={handleCloseModal}
                />
              </Box>
            </Fade>
          </Modal>
        </>
      )}
    </main>
  );
}

export default memo(UserProfile);
