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
  selectUserEmail,
} from "../utils/redux/userSlice";
import { connectSocket } from "../socket-io/socketConnection";
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
  const currentUserEmail = useSelector(selectUserEmail);
  const currentUsername = useSelector(selectUsername);
  const friendsList = useSelector(selectFriendsList);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    } else {
      if (socket) return;

      // only initialize the socket once. Pass all the user_id to socket-server to let
      // the server identify this socket-client
      let newSocket: Socket = connectSocket({
        username: currentUsername,
        user_id: currentUserId,
      });
      setSocket(newSocket);

      // all user will join his/her private room after signing in
      newSocket.emit("joinRoom", `${chatType.private}_${currentUserId}`);
      // let all the friends know the user is online
      newSocket.emit("online", currentUserId);
      // listen all private messages sent to the current user

      aaa(newSocket, dispatch);

      // listen for online event of all friends
      newSocket.on("online", (friend_id) => {
        // update the UI in redux here ///////////////
        console.log(
          `user ${friend_id} just logged in, let him know I am online`
        );
        // let the friend who just logged in know I am online too
        newSocket.emit("online-echo", friend_id);
      });

      newSocket.on("online-echo", (friend_id) => {
        // update the UI in redux here ///////////////
        console.log(`user ${friend_id} let me know he is ALSO online`);
      });

      console.log("user signed, socket connected");
    }
  }, [isLoggedIn, navigate, socket, currentUserId, dispatch, setSocket]);

  function SelectTargetChatRoomHandler(
    friend_id: string,
    friend_name: string,
    type: string
  ) {
    // make the chat board invisible before the chst history is loaded
    let elem = document.getElementById("chat-board");
    if (elem) {
      elem.style.visibility = "hidden";
    }

    if (socket) {
      socket.emit("setCurrentUser", {
        currentTargetRoom: `${type}_${friend_id}`,
        user_id: currentUserId,
        username: currentUsername,
      });
    }

    dispatch(setTargetChatRoom({ friend_id, friend_name, type }));
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

// dispatch can be used in seperate file, need to refactor all the listeners
function aaa(newSocket: any, dispatch: any) {
  newSocket.on(
    "privateMessage_toClient",
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
}
