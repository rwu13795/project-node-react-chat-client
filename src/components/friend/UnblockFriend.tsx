import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { selectTargetFriend, setBlockFriend } from "../../redux/user/userSlice";

// UI //
import styles from "./__BlockFriend.module.css";
import BlockIcon from "@mui/icons-material/Block";
import { Tooltip } from "@mui/material";

interface Props {
  friend_id: string;
  socket: Socket | undefined;
}

function UnblockFriend({ friend_id, socket }: Props): JSX.Element {
  const dispatch = useDispatch();

  function unblockFriendHandler() {
    console.log("unblock friend", friend_id);

    if (socket) {
      socket.emit("block-friend", { friend_id, block: false });
    }
    dispatch(setBlockFriend({ friend_id, block: false, being_blocked: false }));
  }

  return (
    <main>
      <Tooltip title="Unblock friend">
        <BlockIcon
          onClick={unblockFriendHandler}
          className={styles.unblock_button}
        />
      </Tooltip>
    </main>
  );
}

export default memo(UnblockFriend);
