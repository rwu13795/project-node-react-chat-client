import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectOpenAlertModal_timeOut,
  setOpenAlertModal_timeOut,
} from "../../redux/user/userSlice";

// UI //
import styles from "./TimeOutModal.module.css";
import { Modal, Fade, Box, Backdrop, Button } from "@mui/material";

function AlertModalTimeOut(): JSX.Element {
  const dispatch = useDispatch();

  const openModal = useSelector(selectOpenAlertModal_timeOut);

  function handleClose() {
    dispatch(setOpenAlertModal_timeOut(false));
  }

  return (
    <Modal
      disableScrollLock={true}
      open={openModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={openModal}>
        <Box className={styles.modal}>
          <div className={styles.text}>
            To protect your privacy, you were automatically logged out for being
            idle more than 15 minutes.
          </div>
          <div className={styles.buttons_wrapper}>
            <Button
              variant="outlined"
              color="error"
              className={styles.button}
              onClick={handleClose}
            >
              close
            </Button>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}

export default memo(AlertModalTimeOut);
