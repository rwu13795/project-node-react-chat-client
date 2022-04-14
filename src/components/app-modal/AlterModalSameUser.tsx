import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectOpenAlertModal_sameUser,
  setOpenAlertModal_sameUser,
} from "../../redux/user/userSlice";

// UI //
import styles from "./TimeOutModal.module.css";
import { Modal, Fade, Box, Backdrop, Button } from "@mui/material";

function AlterModalSameUser(): JSX.Element {
  const dispatch = useDispatch();

  const openModal = useSelector(selectOpenAlertModal_sameUser);

  function handleClose() {
    dispatch(setOpenAlertModal_sameUser(false));
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
            You have signed in using a different browser or device. You were
            automatically logged out from this session.
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

export default memo(AlterModalSameUser);
