import { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";

import {
  selectCurrentUser,
  selectIsLoggedIn,
} from "../../../redux/user/userSlice";
import ChangeUsername from "./ChangeUsername";
import ChangePW from "./ChangePW";
import AddAvatar from "./AddAvatar";
import { scrollToTop } from "../../../utils";

// UI //
import styles from "./UserProfile.module.css";
import background_2 from "../../../images/background_2.jpg";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Fade,
  Modal,
} from "@mui/material";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import EditIcon from "@mui/icons-material/Edit";

interface Props {
  socket: Socket | undefined;
}

function UserProfile({ socket }: Props): JSX.Element {
  const navigate = useNavigate();

  const { avatar_url, user_id, username, email } =
    useSelector(selectCurrentUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    if (isLoggedIn === false) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

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
                <img
                  src={avatar_url}
                  alt={username[0]}
                  className={styles.avatar}
                />
              </div>
              <div className={styles.edit_avatar}>
                <Button
                  className={styles.edit_button}
                  onClick={handleOpenModal}
                >
                  <EditIcon fontSize="small" />
                  Edit
                </Button>
              </div>
            </div>
            <div className={styles.upper_right}>
              <div className={styles.info_text}>
                <span className={styles.sub_title}>ID:</span>
                <span>{user_id}</span>
              </div>
              <div className={styles.info_text_border}></div>
              <div className={styles.info_text}>
                <span className={styles.sub_title}>Email:</span>
                <span>{email}</span>
              </div>
              <div className={styles.info_text_border}></div>
              <div className={styles.info_text}>
                <span className={styles.sub_title}>Nickname:</span>
                <ChangeUsername username={username} />
              </div>
              <div className={styles.info_text_border}></div>
            </div>
          </div>

          <div className={styles.title} id="main_title">
            Change Password
          </div>
          <div className={styles.lower_body}>
            <ChangePW />
          </div>

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
