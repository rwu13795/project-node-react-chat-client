import { ChangeEvent, memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  removeGroupPosition,
  selectTargetChatRoom,
  setTargetChatRoom,
} from "../../redux/message/messageSlice";
import {
  removeGroup,
  selectTargetGroup,
  selectUserId,
} from "../../redux/user/userSlice";
// import { client } from "../../redux/utils";

// UI //
import styles from "./LeaveGroup.module.css";
import styles_2 from "../menu/left/GroupsList.module.css";
import { Backdrop, Box, Button, Fade, Modal, Tooltip } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import { axios_client, scrollMainPage } from "../../utils";

interface Props {
  homePageMainGridRef: React.MutableRefObject<HTMLDivElement | null>;
}

function RemoveGroup({ homePageMainGridRef }: Props): JSX.Element {
  const dispatch = useDispatch();
  const client = axios_client();

  const currentUserId = useSelector(selectUserId);
  const targetChatRoom = useSelector(selectTargetChatRoom);
  const targetGroup = useSelector(selectTargetGroup(targetChatRoom.id));

  const [openModal, setOpenModal] = useState<boolean>(false);

  // remove the group from groupList after leaving or being kicked
  async function removeGroupHandler() {
    const { group_id, was_kicked } = targetGroup;
    await client.post("http://localhost:5000/api/user/remove-group", {
      group_id,
      user_id: currentUserId,
      was_kicked,
    });

    dispatch(setTargetChatRoom({ id: "", name: "", type: "", date_limit: "" }));
    dispatch(removeGroup({ group_id }));
    dispatch(removeGroupPosition({ group_id }));

    scrollMainPage(homePageMainGridRef, "left");
  }

  function handleClose() {
    setOpenModal(false);
  }
  function handleOpen() {
    setOpenModal(true);
  }

  return (
    <>
      <Tooltip title="Remove Group">
        <DeleteForeverIcon onClick={handleOpen} />
      </Tooltip>

      <Modal
        disableScrollLock={true}
        open={openModal}
        onClose={handleClose}
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
                onClick={handleClose}
              />
            </div>
            <div className={styles.main}>
              <div className={styles.text}>
                Are you sure you want to permanently remove this group from your
                group list?
              </div>
              <div className={styles.buttons_wrapper}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={removeGroupHandler}
                  className={styles.button}
                >
                  Remove
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleClose}
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

export default memo(RemoveGroup);
