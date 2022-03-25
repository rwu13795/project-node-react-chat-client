import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { getNotifications } from "../../redux/message/asyncThunk";
import {
  chatType,
  resetVisitedRoom,
  selectLoadingStatus_msg,
  setLoadingStatus_msg,
} from "../../redux/message/messageSlice";
import { getUserAuth } from "../../redux/user/asyncThunk";

import {
  respondToGroupInvitation,
  selectGroupInvitations,
  selectUserId,
} from "../../redux/user/userSlice";
import { groupInvitationResponse_emitter } from "../../socket-io/emitters";
import { loadingStatusEnum } from "../../utils";

interface Props {
  socket: Socket | undefined;
}

function GroupInvitation({ socket }: Props): JSX.Element {
  const dispatch = useDispatch();

  const groupInvitations = useSelector(selectGroupInvitations);
  const loadingStatus = useSelector(selectLoadingStatus_msg);

  function responseHandler(group_id: string, accept: boolean, index: number) {
    dispatch(respondToGroupInvitation(index));
    if (socket) {
      // update the groups and users_in_groups according to the response
      groupInvitationResponse_emitter(socket, { group_id, accept });
      if (accept) {
        dispatch(setLoadingStatus_msg(loadingStatusEnum.changingTargetRoom));
      }
    }
  }

  return (
    <main>
      {loadingStatus === loadingStatusEnum.changingTargetRoom && (
        <div>Joining the new group</div>
      )}
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
