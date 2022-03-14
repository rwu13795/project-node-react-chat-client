import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import {
  selectResult_groupInvitation,
  selectTargetFriend,
  setBlockFriend,
} from "../../../redux/user/userSlice";
import BlockFriend from "../../friend/BlockFriend";
import DeleteFriend from "../../friend/DeleteFriend";
import UnblockFriend from "../../friend/UnblockFriend";

// UI //
import styles from "./ChatRoomMenu.module.css";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { selectTargetChatRoom } from "../../../redux/message/messageSlice";
import SelectGroupForFriend from "../../group/SelectGroupForFriend";

interface Props {
  friend_id: string;
  socket: Socket | undefined;
}

function PrivateChatMenu({ friend_id, socket }: Props): JSX.Element {
  const targetChatRoom = useSelector(selectTargetChatRoom);
  const targetFriend = useSelector(selectTargetFriend(friend_id));
  const result_invitation = useSelector(selectResult_groupInvitation);

  return (
    <main className={styles.chat_menu}>
      <div className={styles.chat_menu_grid}>
        <div className={styles.chat_menu_grid_left}>
          Chatting with {targetChatRoom.name}-{targetChatRoom.id}
        </div>
        <div className={styles.chat_menu_grid_right}>
          <SelectGroupForFriend socket={socket} friend_id={friend_id} />
          {targetFriend.user_blocked_friend ? (
            <UnblockFriend friend_id={friend_id} socket={socket} />
          ) : (
            <BlockFriend friend_id={friend_id} socket={socket} />
          )}
        </div>
      </div>

      {targetFriend.friend_blocked_user && (
        <div style={{ color: "red", textAlign: "center" }}>
          You were block by this friend, you cannot send him/her any message
          untill you are unblocked!
        </div>
      )}
      {targetFriend.user_blocked_friend && (
        <div className={styles.notification_div} id="block-friend">
          This friend was blocked on {targetFriend.user_blocked_friend_at}
          <DeleteFriend friend_id={friend_id} />
        </div>
      )}
      <div className={styles.notification_div} id={"invitation-result"}>
        {result_invitation}
      </div>
    </main>
  );
}

export default memo(PrivateChatMenu);
