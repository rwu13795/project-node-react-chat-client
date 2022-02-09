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
  selectMessageNotifications,
  setCurrentUserId_message,
  clearNotifications,
  getNotifications,
} from "../utils/redux/messageSlice";
import {
  selectIsLoggedIn,
  selectUsername,
  selectUserId,
  selectFriendsList,
  selectUserEmail,
  selectFriendsOnlineStatus,
  setFriendsOnlineStatus,
} from "../utils/redux/userSlice";
import { connectSocket } from "../socket-io/socketConnection";
import ChatBoard from "./ChatBoard";
import { privateMessage_toClient_listener } from "../socket-io/listeners/private-message-listener";

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
  const friendsOnlineStatus = useSelector(selectFriendsOnlineStatus);
  const messageNotifications = useSelector(selectMessageNotifications);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    } else {
      if (socket) return;
      dispatch(getNotifications(currentUserId));
      dispatch(setCurrentUserId_message(currentUserId));
      // only initialize the socket once. Pass all the user_id to socket-server to let
      // the server identify this socket-client
      let newSocket: Socket = connectSocket(currentUserId);
      setSocket(newSocket);

      // all user will join his/her private room after signing in
      newSocket.emit(
        "join-private-room",
        `${chatType.private}_${currentUserId}`
      );
      // let all the friends know the user is online
      newSocket.emit("online", currentUserId);
      // listen all private messages sent to the current user and set the msg in chatHistory
      privateMessage_toClient_listener(newSocket, dispatch);

      // listen for online event of all friends
      newSocket.on("online", (friend_id) => {
        // update the UI in redux here ///////////////
        console.log(
          `user ${friend_id} just logged in, let him know I am online`
        );
        dispatch(setFriendsOnlineStatus({ friend_id, online: true }));

        // let the friend who just logged in know I am online too
        newSocket.emit("online-echo", friend_id);
      });

      newSocket.on("online-echo", (friend_id) => {
        // update the UI in redux here ///////////////
        console.log(`user ${friend_id} let me know he is ALSO online`);
        dispatch(setFriendsOnlineStatus({ friend_id, online: true }));
      });

      newSocket.on("offline", (friend_id) => {
        // update the UI in redux here ///////////////
        console.log(`user ${friend_id} is offline`);
        dispatch(setFriendsOnlineStatus({ friend_id, online: true }));
      });

      console.log("user signed, socket connected");
    }
  }, [isLoggedIn, navigate, socket, currentUserId, dispatch, setSocket]);

  function SelectTargetChatRoomHandler(id: string, name: string, type: string) {
    // delete the new msg notifications in the DB when the user leave the current room

    // make the chat board invisible before the chst history is loaded
    let elem = document.getElementById("chat-board");
    if (elem) {
      elem.style.visibility = "hidden";
    }

    dispatch(setTargetChatRoom({ id, name, type }));

    // (1) //
    // dispatch(storeChatRoom_and_clearNotifications({friend_id, type}))

    // load the latest 20 chat messages from server in the specific room only once
    dispatch(loadChatHistory({ type, id, currentUserId }));
    dispatch(clearNotifications({ type, id }));

    if (socket) {
      socket.emit("current-target-room", `${type}_${id}`);
    }

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
              <div>
                notifications:{" "}
                {messageNotifications[`${chatType.private}_${friend_id}`]}{" "}
              </div>
              <div>
                friend ${friend_username} is online:{" "}
                {friendsOnlineStatus[friend_id] ? "yes" : "no"}
              </div>
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

// NOTES //
/*
(1) 
  set targetChatRoom in session store and clear the notifications associated 
  with this chatRoom in DB while enter the room. 
  By storing the targetChatRoom in session, I could find out what the last
  ChatRoom the user was in before disconnected.
  This is the only way I can clear all the notifications in that room
  after user disconnected in the socket "disconnect" listener.


*/
