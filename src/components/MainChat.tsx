import axios from "axios";
import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import {
  chatType,
  MessageObject,
  RoomIdentifier,
  addNewMessageToHistory,
  setTargetChatRoom,
  selectMessageNotifications,
  setCurrentUserId_message,
} from "../redux/message/messageSlice";
import {
  selectIsLoggedIn,
  selectUsername,
  selectUserId,
  selectFriendsList,
  selectUserEmail,
  selectFriendsOnlineStatus,
  setFriendsOnlineStatus,
  selectAddFriendRequests,
  selectResult_addFriendRequest,
  UserState,
} from "../redux/user/userSlice";
import { connectSocket } from "../socket-io/socketConnection";
import ChatBoard from "./ChatBoard";
import { privateMessage_toClient_listener } from "../socket-io/listeners/private-message-listener";
import { getNotifications } from "../redux/message/asyncThunk/get-notifications";
import { loadChatHistory } from "../redux/message/asyncThunk/load-chat-history";
import { clearNotifications } from "../redux/message/asyncThunk/clear-notifications";
import SearchUser from "./SearchUser";
import { addFriendRequest_listener } from "../socket-io/listeners/add-friend-request-listener";
import { check_addFriendRequest_listener } from "../socket-io/listeners/check-add-friend-request-listener";
import { addFriendResponse_listener } from "../socket-io/listeners/add-friend-response-listener";
import { AsyncThunkAction, Dispatch } from "@reduxjs/toolkit";
import { getUserAuth } from "../redux/user/asyncThunk/get-user-auth";

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
  const addFriendRequests = useSelector(selectAddFriendRequests);

  const [loading, setLoading] = useState<boolean>(false);

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
      newSocket.emit("online");
      // listen all private messages sent to the current user and set the msg in chatHistory
      privateMessage_toClient_listener(newSocket, dispatch);
      addFriendRequest_listener(newSocket, dispatch);
      check_addFriendRequest_listener(newSocket, dispatch);
      addFriendResponse_listener(newSocket, dispatch, currentUserId);

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
        dispatch(setFriendsOnlineStatus({ friend_id, online: false }));
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

    // load the latest 20 chat messages from server in the specific room only once
    dispatch(loadChatHistory({ type, id, currentUserId }));
    dispatch(clearNotifications({ type, id }));

    if (socket) {
      // (1) //
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

  function responseHandler(
    sender_id: string,
    sender_username: string,
    target_id: string,
    target_username: string,
    accept: boolean
  ) {
    if (socket) {
      // update the friends_pair and notificaiton if request is accepted
      socket.emit("add-friend-response", {
        sender_id,
        sender_username,
        target_id,
        target_username,
        accept,
      });
    }
    if (accept) {
      // after the user accepted the request, get the updated friends_pair, private_message and
      // notification from server. Have to wait for a few second since the DB might be being updated
      // need to add loading icon , setAccepetLoading to true
      setLoading(true);
      setTimeout(() => {
        // don't initialize the onlineStatus, otherwise all friends will be marked as offline
        dispatch(getUserAuth({ initialize: false }));
        dispatch(getNotifications(currentUserId));
        setLoading(false);
      }, 3000);
      // wait for 4 seconds, the getUserAuth() should finish updating the friendList
      // then let the new added friend know this user is online.
      setTimeout(() => {
        if (socket) {
          socket.emit("online", sender_id);
        }
      }, 5000);
    }
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
                friend {friend_username} is online:{" "}
                {friendsOnlineStatus[friend_id] ? "yes" : "no"}
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <h4>Add Friend Requests</h4>
        {addFriendRequests.map((req, index) => {
          return (
            <div key={index}>
              {req.sender_email} username: {req.sender_username} requested
              add-friend
              <div>Message: {req.message}</div>
              <button
                onClick={() =>
                  responseHandler(
                    req.sender_id,
                    req.sender_username,
                    currentUserId,
                    currentUsername,
                    true
                  )
                }
              >
                Accept
              </button>
              <button
                onClick={() =>
                  responseHandler(
                    req.sender_id,
                    req.sender_username,
                    currentUserId,
                    currentUsername,
                    false
                  )
                }
              >
                Reject
              </button>
              {loading && "Loading ............"}
            </div>
          );
        })}
      </div>

      <br />
      <SearchUser socket={socket} />

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
  set targetChatRoom in the socket.currentUser, the data set inside will still be accessible
  in the socket.on("disconnect") listener. In the listener callback, I can clear the notification
  in the room where the user was in when he/she disconnected.
*/
