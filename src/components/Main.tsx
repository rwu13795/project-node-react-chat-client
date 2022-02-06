import axios from "axios";
import { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { setCurrentMessageRecipient } from "../utils/redux/messageSlice";
import {
  selectIsLoggedIn,
  selectUsername,
  selectUserId,
  selectFriendsList,
} from "../utils/redux/userSlice";
import ChatBoard from "./ChatBoard";

interface Props {
  socket: Socket | undefined;
}

function Main({ socket }: Props): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user_id = useSelector(selectUserId);
  const currentUsername = useSelector(selectUsername);
  const friendsList = useSelector(selectFriendsList);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    } else {
      if (socket) {
        socket.emit("joinRoom", user_id);
      }
    }
  }, [isLoggedIn, navigate, socket, user_id]);

  //   function emitMessage() {
  //     const sendTo = window.prompt("send to ...");
  //     if (socket) {
  //       socket.emit("messageToServer", {
  //         sendTo,
  //         msg: `message from ${currentUsername}`,
  //       });
  //     }
  //   }

  function selectFriendHandler(friend_id: string) {
    dispatch(setCurrentMessageRecipient(friend_id));
  }

  return (
    <main>
      <div>
        {friendsList.map((friend) => {
          // choose which friend to send message
          // pass the friend_id inside the message body, and the server
          // will emit the messsage to the room where the friend is in
          return (
            <div key={friend.friend_id}>
              <button onClick={() => selectFriendHandler(friend.friend_id)}>
                {friend.friend_username + friend.friend_id}
              </button>
            </div>
          );
        })}
      </div>

      <div>
        <ChatBoard socket={socket} />
      </div>
    </main>
  );
}

export default memo(Main);
