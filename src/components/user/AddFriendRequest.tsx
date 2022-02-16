import { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import { getNotifications } from "../../redux/message/asyncThunk/get-notifications";
import { getUserAuth } from "../../redux/user/asyncThunk/get-user-auth";
import {
  selectAddFriendRequests,
  selectUserId,
  selectUsername,
} from "../../redux/user/userSlice";

interface Props {
  socket: Socket | undefined;
}

function AddFriendRequest({ socket }: Props): JSX.Element {
  const dispatch = useDispatch();

  const currentUserId = useSelector(selectUserId);
  const currentUsername = useSelector(selectUsername);
  const addFriendRequests = useSelector(selectAddFriendRequests);
  const [loading, setLoading] = useState<boolean>(false);

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
      <h3>Add Friend Request</h3>
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
    </main>
  );
}

export default memo(AddFriendRequest);
