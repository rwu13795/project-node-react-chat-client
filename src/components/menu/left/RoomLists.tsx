import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  leaveGroup,
  selectUserId,
  setLoadingStatus_user,
  setResult_groupInvitation,
} from "../../../redux/user/userSlice";
import {
  chatType,
  selectTargetChatRoom,
  setLoadingStatus_msg,
  setTargetChatRoom,
} from "../../../redux/message/messageSlice";
import { getGroupMembersList_database } from "../../../redux/user/asyncThunk";
import {
  clearNotifications,
  loadChatHistory_database,
} from "../../../redux/message/asyncThunk";
import FriendsList from "./FriendsList";
import GroupsList from "./GroupsList";

// UI //
import styles from "./RoomLists.module.css";
import { changeTargetRoom_emitter } from "../../../socket-io/emitters";
import { loadingStatusEnum } from "../../../utils";

interface Props {
  socket: Socket | undefined;
}

function RoomLists({ socket }: Props): JSX.Element {
  const dispatch = useDispatch();
  const currentUserId = useSelector(selectUserId);
  const targetChatRoom = useSelector(selectTargetChatRoom);

  function selectTargetChatRoomHandler(
    nextRoom_id: string,
    nextRoom_name: string,
    nextRoom_type: string,
    date_limit?: string | null
  ) {
    // let elem = document.getElementById("chat-board");
    // if (elem) elem.scrollTo({ top: elem.scrollHeight, behavior: "auto" });
    dispatch(setLoadingStatus_msg(loadingStatusEnum.changingTargetRoom));

    // clear the notifications of the previous room in database, only when the user
    // enters the next room
    const previousRoom_id = targetChatRoom.id;
    const previousRoom_type = targetChatRoom.type;
    dispatch(
      setTargetChatRoom({
        id: nextRoom_id,
        name: nextRoom_name,
        type: nextRoom_type,
        date_limit: date_limit || "",
      })
    );
    // load the latest 20 chat messages from server in the specific room only once
    dispatch(
      loadChatHistory_database({
        targetRoom_type: nextRoom_type,
        targetRoom_id: nextRoom_id,
        currentUserId,
        date_limit: date_limit || "",
      })
    );
    // this clearNotifications will clear the notifications of previous room in database,
    // then clear notifications of next room in the redux-store.
    dispatch(
      clearNotifications({
        previousRoom_id,
        previousRoom_type,
        nextRoom_type,
        nextRoom_id,
      })
    );
    // if the target room is a group, then fetch the member list from DB for that group
    if (nextRoom_type === chatType.group) {
      console.log("getting member list", nextRoom_id);
      dispatch(
        getGroupMembersList_database({
          group_id: nextRoom_id,
          initialize: false,
        })
      );
    }
    dispatch(setResult_groupInvitation(""));

    // (1) //
    if (socket)
      changeTargetRoom_emitter(socket, {
        room_id: `${nextRoom_type}_${nextRoom_id}`,
      });

    dispatch(setLoadingStatus_msg(loadingStatusEnum.idle));
    dispatch(setLoadingStatus_user(loadingStatusEnum.idle));
  }

  return (
    <main className={styles.main}>
      <GroupsList
        socket={socket}
        selectTargetChatRoomHandler={selectTargetChatRoomHandler}
      />
      <FriendsList
        socket={socket}
        selectTargetChatRoomHandler={selectTargetChatRoomHandler}
      />
    </main>
  );
}

export default memo(RoomLists);

// NOTES //
/*
(1) 
  set targetChatRoom in the socket.currentUser, the data set inside will still be accessible
  in the socket.on("disconnect") listener. In the listener callback, I can clear the notification
  in the room where the user was in when he/she disconnected.
*/
