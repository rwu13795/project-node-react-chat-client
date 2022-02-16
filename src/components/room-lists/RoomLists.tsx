import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import { selectUserId } from "../../redux/user/userSlice";
import { clearNotifications } from "../../redux/message/asyncThunk/clear-notifications";
import { loadChatHistory_database } from "../../redux/message/asyncThunk/load-chat-history";
import { setTargetChatRoom } from "../../redux/message/messageSlice";
import FriendsList from "./FriendsList";
import GroupsList from "./GroupsList";

interface Props {
  socket: Socket | undefined;
}

function RoomLists({ socket }: Props): JSX.Element {
  const dispatch = useDispatch();
  const currentUserId = useSelector(selectUserId);

  function selectTargetChatRoomHandler(id: string, name: string, type: string) {
    // make the chat board invisible before the chst history is loaded
    let elem = document.getElementById("chat-board");
    if (elem) {
      elem.style.visibility = "hidden";
    }

    dispatch(setTargetChatRoom({ id, name, type }));
    // load the latest 20 chat messages from server in the specific room only once
    dispatch(loadChatHistory_database({ type, id, currentUserId }));
    dispatch(clearNotifications({ type, id }));

    // (1) //
    if (socket) socket.emit("current-target-room", `${type}_${id}`);

    setTimeout(() => {
      if (elem) {
        // make the chat board invisible after the chst history is loaded and
        // the view is scrolled to the button, then display the chat board
        elem.scrollTo({
          top: elem.scrollHeight,
          behavior: "auto",
        });
        elem.style.visibility = "visible";
      }
    }, 100);
  }

  return (
    <main>
      <h3>RoomLists</h3>
      <GroupsList selectTargetChatRoomHandler={selectTargetChatRoomHandler} />
      <FriendsList selectTargetChatRoomHandler={selectTargetChatRoomHandler} />
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
