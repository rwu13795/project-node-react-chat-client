import { memo, useState } from "react";

// UI //
import styles from "./OptionsGroupChatMenu.module.css";
import styles_2 from "../top/UserAvatar.module.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Button, Popover, Tooltip } from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import GroupsIcon from "@mui/icons-material/Groups";
import LeaveGroup from "../../group/LeaveGroup";
import { Socket } from "socket.io-client";
import BlockUnblockFriend from "../../friend/BlockUnblockFriend";

interface Props {
  socket: Socket | undefined;
  friend_id: string;
  user_blocked_friend: boolean;
  openGroupForFriendHandler: () => void;
}

function OptionsPrivateChatManu({
  socket,
  friend_id,
  user_blocked_friend,
  openGroupForFriendHandler,
}: Props): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const open = Boolean(anchorEl);

  function openPopoverHandler(event: React.MouseEvent<HTMLDivElement>) {
    setAnchorEl(event.currentTarget);
  }
  function handleClose() {
    setAnchorEl(null);
  }

  function toggleInviteFriend() {
    openGroupForFriendHandler();
    handleClose();
  }

  return (
    <main className={styles.main}>
      <Tooltip title="More Options">
        <div className={styles.option_button} onClick={openPopoverHandler}>
          <MoreVertIcon />
        </div>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div className={styles_2.popover_box}>
          <Button className={styles_2.button} onClick={toggleInviteFriend}>
            <GroupAddIcon />
            <div>Invite Friend</div>
          </Button>

          <BlockUnblockFriend
            friend_id={friend_id}
            socket={socket}
            user_blocked_friend={user_blocked_friend}
            isSmall={true}
          />
        </div>
      </Popover>
    </main>
  );
}

export default memo(OptionsPrivateChatManu);
