import { memo } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import { selectCurrentUser } from "../../../redux/user/userSlice";
import AddAvatar from "./AddAvatar";
import ChangeUsername from "./ChangeUsername";

// UI //
import styles from "./UserProfile.module.css";
import background_2 from "../../../images/background_2.jpg";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

interface Props {
  socket: Socket | undefined;
}

function UserProfile({ socket }: Props): JSX.Element {
  const { avatar_url, user_id, username, email } =
    useSelector(selectCurrentUser);

  function editAvatarHandler() {}
  function editUsernameHandler() {}

  return (
    <main className={styles.main} id="main_body">
      <div className={styles.title} id="main_title">
        User Profile
      </div>
      <div className={styles.upper_body}>
        <div className={styles.upper_left}>
          <div className={styles.avatar_wrapper}>
            <img src={avatar_url} alt={username[0]} className={styles.avatar} />
          </div>
          <div className={styles.edit_avatar}>
            <Button className={styles.edit_button} onClick={editAvatarHandler}>
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
            <div className={styles.change_name_wrapper}>
              <span>{username}</span>
              <Button
                className={styles.edit_button}
                onClick={editUsernameHandler}
              >
                <EditIcon fontSize="small" />
                Edit
              </Button>
            </div>
          </div>
          <div className={styles.info_text_border}></div>
        </div>
      </div>

      <div className={styles.title} id="main_title">
        Change Password
      </div>
      <div className={styles.lower_body}>
        <AddAvatar socket={socket} />
      </div>

      <img src={background_2} alt="bg" className={styles.img_wrapper} />
    </main>
  );
}

export default memo(UserProfile);
