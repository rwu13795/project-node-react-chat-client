import { memo } from "react";

// UI //
import styles from "./ViewUserProfile.module.css";
import styles_2 from "../../menu/left/GroupsList.module.css";
import { Avatar, Backdrop, Box, Fade, Modal } from "@mui/material";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";

interface Props {
  openModal: boolean;
  user_id: string;
  username: string;
  email: string;
  avatar_url?: string;
  closeModalHandler: () => void;
}

function ViewUserProfile({
  openModal,
  user_id,
  username,
  email,
  avatar_url,
  closeModalHandler,
}: Props): JSX.Element {
  return (
    <main>
      <Modal
        disableScrollLock={true}
        open={openModal}
        onClose={closeModalHandler}
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
                onClick={closeModalHandler}
              />
            </div>
            <div className={styles.profile_wrapper}>
              <Avatar
                className={styles.avatar}
                src={avatar_url ? avatar_url : username[0]}
                alt={username[0]}
              />

              <div className={styles.info_wrapper}>
                <div className={styles.text_wrapper}>
                  <span className={styles.sub_title}>ID:</span>
                  <span className={styles.text}>{user_id}</span>
                </div>
                <div className={styles.border}></div>
                <div className={styles.text_wrapper}>
                  <span className={styles.sub_title}>Email:</span>
                  <span className={styles.text}>{email}</span>
                </div>
                <div className={styles.border}></div>
                <div className={styles.text_wrapper}>
                  <span className={styles.sub_title}>Username:</span>
                  <span className={styles.text}>{username}</span>
                </div>
                <div className={styles.border}></div>
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </main>
  );
}

export default memo(ViewUserProfile);
