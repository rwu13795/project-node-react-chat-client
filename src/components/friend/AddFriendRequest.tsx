import { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  clearAddFriendRequests,
  selectAddFriendRequests,
  selectUserId,
  selectUsername,
  selectUserOnlineStatus,
} from "../../redux/user/userSlice";
import { getNotifications } from "../../redux/message/asyncThunk";
import { getUserAuth } from "../../redux/user/asyncThunk";

interface Props {
  socket: Socket | undefined;
}

function AddFriendRequest({ socket }: Props): JSX.Element {
  const dispatch = useDispatch();

  const currentUserId = useSelector(selectUserId);
  const currentUsername = useSelector(selectUsername);
  const currentOnlineStatus = useSelector(selectUserOnlineStatus);
  const addFriendRequests = useSelector(selectAddFriendRequests);
  const [loading, setLoading] = useState<boolean>(false);

  function responseHandler(
    sender_id: string,
    sender_username: string,
    accept: boolean,
    index: number
  ) {
    if (socket) {
      // update the friends_pair and notificaiton if request is accepted
      socket.emit("add-friend-response", {
        sender_id,
        sender_username,
        target_id: currentUserId,
        target_username: currentUsername,
        accept,
      });
    }
    if (accept) {
      // after the user accepted the request, get the updated friends_pair, private_message and
      // notification from server. Have to wait for a few second since the DB might be being updated
      // !!!! need to add loading icon here !!!!
      setLoading(true);
      setTimeout(() => {
        // don't initialize the onlineStatus, otherwise all friends will be marked as offline
        dispatch(getUserAuth());
        dispatch(getNotifications({ currentUserId }));
        setLoading(false);
      }, 4000);
      // wait for 4 seconds, the getUserAuth() should finish updating the friendList
      // then let the new added friend know this user is online.
      setTimeout(() => {
        if (socket) {
          socket.emit("online", {
            target_id: sender_id,
            onlineStatus: currentOnlineStatus,
          });
        }
      }, 6000);
    } else {
      dispatch(clearAddFriendRequests(index));
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
                    true,
                    index
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
                    false,
                    index
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
