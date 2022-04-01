import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { useDispatch } from "react-redux";

import { signOut } from "../../../redux/user/asyncThunk";

// UI //
import styles from "./UserAvatar.module.css";
import { Avatar, Button, Popover } from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";
import LogoutIcon from "@mui/icons-material/Logout";
import { setIsLoggedIn } from "../../../redux/user/userSlice";
import { logout_emitter } from "../../../socket-io/emitters";
import { AvatarOptions } from "../../../utils";

interface Props {
  username: string;
  avatar_url: string | undefined;
  socket: Socket | undefined;
  option: AvatarOptions;
  hasPopoverMenu?: boolean;
}

function UserAvatar({
  username,
  avatar_url,
  socket,
  option,
  hasPopoverMenu,
}: Props): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const open = Boolean(anchorEl);

  function openListHandler(event: React.MouseEvent<HTMLDivElement>) {
    setAnchorEl(event.currentTarget);
  }
  function handleClose() {
    setAnchorEl(null);
  }

  function toUserProfile() {
    navigate("/profile");
    handleClose();
  }
  function logoutHandler() {
    handleClose();
    if (socket) {
      logout_emitter(socket);
    }

    dispatch(signOut());
    dispatch(setIsLoggedIn(false));
    navigate("/");
  }

  let main = styles.main + " " + styles.size_1;
  let avatar = styles.avatar + " " + styles.avatar_size_1;
  if (option === AvatarOptions.listAvatar) {
    main = styles.main + " " + styles.size_2;
    avatar = styles.avatar + " " + styles.avatar_size_2;
  }

  return (
    <main className={main}>
      <Avatar
        src={avatar_url}
        alt={username[0]}
        className={avatar}
        onClick={openListHandler}
      />
      {hasPopoverMenu && (
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <div className={styles.popover_box}>
            <Button onClick={toUserProfile} className={styles.button}>
              <FaceIcon /> User Profile
            </Button>
            <Button onClick={logoutHandler} className={styles.button}>
              <LogoutIcon /> Log out
            </Button>
          </div>
        </Popover>
      )}
    </main>
  );
}

export default memo(UserAvatar);
