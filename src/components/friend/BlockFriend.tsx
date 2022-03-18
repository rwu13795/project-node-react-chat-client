import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import { selectTargetFriend, setBlockFriend } from "../../redux/user/userSlice";
// UI //
import styles from "./BlockFriend.module.css";
import BlockIcon from "@mui/icons-material/Block";
import { Tooltip } from "@mui/material";
import { blockFriend_emitter } from "../../socket-io/emitters";

interface Props {
  friend_id: string;
  socket: Socket | undefined;
}

function BlockFriend({ socket, friend_id }: Props): JSX.Element {
  const dispatch = useDispatch();

  function blockFriendHandler() {
    if (socket) {
      blockFriend_emitter({ socket, friend_id, block: true });
    }
    dispatch(setBlockFriend({ friend_id, block: true, being_blocked: false }));
    setTimeout(() => {
      let elem = document.getElementById("block-friend");
      if (elem) elem.style.maxHeight = elem.scrollHeight + "px";
    }, 500);
  }

  return (
    <main>
      <Tooltip title="Block Friend">
        <BlockIcon
          onClick={blockFriendHandler}
          className={styles.block_button}
        />
      </Tooltip>
    </main>
  );
}

export default memo(BlockFriend);
