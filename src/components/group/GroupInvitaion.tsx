import { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { getUserAuth } from "../../redux/user/asyncThunk/get-user-auth";
import {
  respondToGroupInvitation,
  selectGroupInvitations,
} from "../../redux/user/userSlice";

interface Props {
  socket: Socket | undefined;
}

function GroupInvitation({ socket }: Props): JSX.Element {
  const dispatch = useDispatch();

  const groupInvitations = useSelector(selectGroupInvitations);

  const [loading, setLoading] = useState<boolean>(false);

  function responseHandler(group_id: string, accept: boolean, index: number) {
    if (socket) {
      // update the groups and users_in_groups according to the response
      socket.emit("group-invitation-response", {
        group_id,
        accept,
      });
    }
    dispatch(respondToGroupInvitation(index));

    // if (accept) {
    //   setLoading(true);
    //   setTimeout(() => {
    //     // get the new groupsList from the DB
    //     // don't initialize the onlineStatus, otherwise all friends will be marked as offline
    //     dispatch(getUserAuth({ initialize: false }));
    //     // dispatch(getNotifications(currentUserId));
    //     setLoading(false);
    //   }, 4000);
    //   // wait for 4 seconds, the getUserAuth() should finish updating the friendList
    //   // then let the new added friend know this user is online.
    //   // setTimeout(() => {
    //   //   if (socket) {
    //   //     socket.emit("online", sender_id);
    //   //   }
    //   // }, 6000);
    // }
  }

  return (
    <main>
      <h4>Group Invitation</h4>
      {groupInvitations.map((inv, index) => {
        return (
          !inv.was_responded && (
            <div key={inv.group_id}>
              Friend "{inv.inviter_name}" invites you to join Group "
              {inv.group_name}"
              <button
                onClick={() => responseHandler(inv.group_id, true, index)}
              >
                accpet
              </button>
              <button
                onClick={() => responseHandler(inv.group_id, false, index)}
              >
                reject
              </button>
            </div>
          )
        );
      })}
    </main>
  );
}

export default memo(GroupInvitation);