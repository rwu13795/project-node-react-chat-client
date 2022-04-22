import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectFriendsList,
  selectOpenViewProfileModal,
  selectViewProfileTarget,
  setOpenViewProfileModal,
  setViewProfileTarget,
} from "../../../redux/user/userSlice";

// UI //
import styles from "./ViewUserProfile.module.css";
import styles_2 from "../../menu/left/GroupsList.module.css";
import { Avatar, Backdrop, Box, Fade, Modal } from "@mui/material";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import SetFriendDisplayName from "./SetFriendDisplayName";

// NOTE //
// the ViewUserProfile will be re-rendered for as many times as the number of the
// messages if I put the component inside the ChatMessageGroup or ChatMessagePrivate
// I should put this component inside the ChatRoom, and use only one state object to
// store the target user info for this ViewUserProfile
// use redux to open/close the modal, and change the target user

function ViewUserProfile(): JSX.Element {
  const dispatch = useDispatch();

  const openModal = useSelector(selectOpenViewProfileModal);
  const friendsList = useSelector(selectFriendsList);
  const { email, username, user_id, avatar_url } = useSelector(
    selectViewProfileTarget
  );

  const [isFriend, setIsFriend] = useState<boolean>(false);
  // const isFriend =friendsList[user_id]? true: falsfe

  const [friendDisplayName, setFriendDisplayName] = useState<string>("");

  useEffect(() => {
    if (friendsList[user_id]) {
      setIsFriend(true);

      setFriendDisplayName(() => {
        if (!friendsList[user_id].friend_display_name) {
          return "";
        } else {
          return friendsList[user_id].friend_display_name as string;
        }
      });
    }
  }, [user_id, friendsList]);

  function closeModalHandler() {
    dispatch(setOpenViewProfileModal(false));
    dispatch(
      setViewProfileTarget({
        email: "",
        user_id: "",
        username: "",
        avatar_url: undefined,
      })
    );
    setIsFriend(false);
  }

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
              <Avatar className={styles.avatar} src={avatar_url} />

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

                {isFriend && (
                  <>
                    <div className={styles.text_wrapper}>
                      <span className={styles.sub_title}>Display name:</span>
                      <span className={styles.text}>
                        <SetFriendDisplayName
                          friend_id={user_id}
                          friend_display_name={friendDisplayName}
                        />
                      </span>
                    </div>
                    <div className={styles.border}></div>
                  </>
                )}
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </main>
  );
}

export default memo(ViewUserProfile);
