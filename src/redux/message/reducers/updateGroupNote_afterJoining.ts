import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { NewGroupNotification } from "../../../socket-io/listeners";
import { chatType, MessageState, sortByLastAdded } from "../messageSlice";

export function updateGroupNote_afterJoining_reducer(
  state: WritableDraft<MessageState>,
  action: PayloadAction<NewGroupNotification>
) {
  // push the new group to top by adding the new notification
  const note = action.payload;
  let target_id = `${chatType.group}_${note.group_id}`;
  if (!state.groupNotifications[target_id]) {
    state.groupNotifications[target_id] = {
      count: 0,
      last_added_at: 0,
    };
    // if this is a new group, push the new group_id to the position array
    // otherwise, do nothing, since user who got kicked or left can join in the same group
    state.groupsPosition.push(note.group_id.toString());
  }
  state.groupNotifications[target_id].count = note.count;
  state.groupNotifications[target_id].last_added_at = new Date(
    note.last_added_at
  ).getTime();

  // use the sort to initialize the position of Groups by the lastest notification
  state.groupsPosition = sortByLastAdded(
    state.groupsPosition,
    state.groupNotifications,
    chatType.group
  );
}
