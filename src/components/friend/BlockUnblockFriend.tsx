import { memo } from "react";
import { useDispatch } from "react-redux";
import { Socket } from "socket.io-client";

import { setBlockFriend } from "../../redux/user/userSlice";
import { blockFriend_emitter } from "../../socket-io/emitters";

// UI //
import styles from "./BlockUnblockFriend.module.css";
import styles_2 from "../menu/top/UserAvatar.module.css";
import BlockIcon from "@mui/icons-material/Block";
import { Button, Tooltip } from "@mui/material";

interface Props {
  friend_id: string;
  socket: Socket | undefined;
  user_blocked_friend: boolean;
  isSmall?: boolean;
}

function BlockFriend({
  socket,
  friend_id,
  user_blocked_friend,
  isSmall,
}: Props): JSX.Element {
  const dispatch = useDispatch();

  function blockFriendHandler() {
    if (socket) {
      blockFriend_emitter(socket, { friend_id, block: true });
    }
    dispatch(setBlockFriend({ friend_id, block: true, being_blocked: false }));
  }

  function unblockFriendHandler() {
    if (socket) {
      blockFriend_emitter(socket, { friend_id, block: false });
    }
    dispatch(setBlockFriend({ friend_id, block: false, being_blocked: false }));
  }

  return (
    <>
      {isSmall ? (
        user_blocked_friend ? (
          <Button className={styles_2.button} onClick={unblockFriendHandler}>
            <BlockIcon /> Unblock Friend
          </Button>
        ) : (
          <Button className={styles_2.button} onClick={blockFriendHandler}>
            <BlockIcon />
            Block Friend
          </Button>
        )
      ) : user_blocked_friend ? (
        <Tooltip title="Unblock friend">
          <BlockIcon
            onClick={unblockFriendHandler}
            className={styles.unblock_button}
          />
        </Tooltip>
      ) : (
        <Tooltip title="Block Friend">
          <BlockIcon
            onClick={blockFriendHandler}
            className={styles.block_button}
          />
        </Tooltip>
      )}
    </>
  );
}

export default memo(BlockFriend);
