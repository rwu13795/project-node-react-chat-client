import axios from "axios";
import { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import {
  chatType,
  loadChatHistory,
  MessageObject,
  RoomIdentifier,
  addNewMessageToHistory,
  setTargetChatRoom,
} from "../utils/redux/messageSlice";
import {
  selectIsLoggedIn,
  selectUsername,
  selectUserId,
  selectFriendsList,
} from "../utils/redux/userSlice";
import { connectSocket } from "../utils/socketConnection";
import ChatBoard from "./ChatBoard";

interface Props {
  socket: Socket | undefined;
  setSocket: React.Dispatch<React.SetStateAction<Socket | undefined>>;
}

function MainChat({ socket, setSocket }: Props): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const currentUserId = useSelector(selectUserId);
  const currentUsername = useSelector(selectUsername);
  const friendsList = useSelector(selectFriendsList);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    } else {
      if (socket) return;

      console.log("setting up socket");

      // only initialize the socket once
      let newSocket: Socket = connectSocket();
      setSocket(newSocket);

      // all user will join his/her private room after signing in
      newSocket.emit("joinRoom", `${chatType.private}_${currentUserId}`);
      // listen all messages sent from server to the current user
      newSocket.on(
        "messageToClients",
        (messageObject: MessageObject & RoomIdentifier) => {
          console.log(messageObject);
          dispatch(addNewMessageToHistory(messageObject));

          // scroll to down to show the new message
          let elem = document.getElementById("chat-board");
          setTimeout(() => {
            if (elem) {
              elem.scrollTo({
                top: elem.scrollHeight,
                behavior: "smooth",
              });
            }
          }, 80);
        }
      );

      console.log("user signed, socket connected");
    }
  }, [isLoggedIn, navigate, socket, currentUserId, dispatch, setSocket]);

  function SelectTargetChatRoomHandler(id: string, name: string, type: string) {
    // make the chat board invisible before the chst history is loaded
    let elem = document.getElementById("chat-board");
    if (elem) {
      elem.style.visibility = "hidden";
    }

    dispatch(setTargetChatRoom({ id, name, type }));
    // load chat history from server in the specific room only once
    // all new messages will be store Redux for the session
    dispatch(loadChatHistory(currentUserId));

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
      <div>
        {friendsList.map((friend) => {
          // choose which friend to send message
          // pass the friend_id inside the message body, and the server
          // will emit the messsage to the room where the friend is in
          let { friend_id, friend_username } = friend;
          return (
            <div key={friend.friend_id}>
              <button
                onClick={() =>
                  SelectTargetChatRoomHandler(
                    friend_id,
                    friend_username,
                    chatType.private
                  )
                }
              >
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

export default memo(MainChat);
