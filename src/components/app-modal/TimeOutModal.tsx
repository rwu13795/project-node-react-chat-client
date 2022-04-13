import { memo } from "react";

// UI //
import styles from "./TimeOutModal.module.css";
import { Modal, Fade, Box, Backdrop, Button } from "@mui/material";

interface Props {
  oponModal: boolean;
  handleStaySignedIn: () => void;
  handleSignOut: () => void;
}

function TimeOutModal({
  oponModal,
  handleStaySignedIn,
  handleSignOut,
}: Props): JSX.Element {
  return (
    <Modal
      disableScrollLock={true}
      open={oponModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={oponModal}>
        <Box className={styles.modal}>
          <div className={styles.text}>
            You have been idle for 15 minutes, and you will be automatically
            logged out after 1 minute.
          </div>
          <div className={styles.buttons_wrapper}>
            <Button
              variant="contained"
              color="secondary"
              className={styles.button + " " + styles.button_color}
              onClick={handleStaySignedIn}
            >
              Stay signed in
            </Button>
            <Button
              variant="outlined"
              color="error"
              className={styles.button}
              onClick={handleSignOut}
            >
              Sign out
            </Button>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}

export default memo(TimeOutModal);
