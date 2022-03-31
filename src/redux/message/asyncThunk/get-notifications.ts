import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";

import { RootState } from "../..";
import { loadingStatusEnum } from "../../../utils";
import { client, serverUrl } from "../../utils";
import { chatType, MessageState, sortByLastAdded } from "../messageSlice";

interface PrivateNotifications {
  sender_id: string;
  count: number;
  last_added_at: string;
}
interface GroupNotifications {
  group_id: string;
  count: number;
  last_added_at: string;
}
interface Payload {
  private: PrivateNotifications[];
  group: GroupNotifications[];
}
interface Res_body {
  currentUserId: string;
}

export const getNotifications = createAsyncThunk<
  Payload,
  Res_body,
  { state: RootState }
>("message/getNotifications", async ({ currentUserId }) => {
  const response = await client.get<Payload>(
    serverUrl + `/chat/get-notifications?user_id=${currentUserId}`
  );

  return response.data;
});

export function getNotifications_fulfilled(
  state: WritableDraft<MessageState>,
  action: PayloadAction<Payload>
) {
  // initialize the private chat notification
  state.friendsPosition = [];
  action.payload.private.forEach((note) => {
    let target_id = `${chatType.private}_${note.sender_id}`;
    if (!state.friendNotifications[target_id]) {
      state.friendNotifications[target_id] = {
        count: 0,
        last_added_at: 0,
      };
    }
    state.friendNotifications[target_id].count = note.count;
    state.friendNotifications[target_id].last_added_at = new Date(
      note.last_added_at
    ).getTime();
    state.friendsPosition.push(note.sender_id);
  });
  // use the sort to initialize the position of Friends by the lastest notification
  state.friendsPosition = sortByLastAdded(
    state.friendsPosition,
    state.friendNotifications,
    chatType.private
  );

  // initialize the group chat notification
  state.groupsPosition = [];
  action.payload.group.forEach((note) => {
    let target_id = `${chatType.group}_${note.group_id}`;
    if (!state.groupNotifications[target_id]) {
      state.groupNotifications[target_id] = {
        count: 0,
        last_added_at: 0,
      };
    }
    state.groupNotifications[target_id].count = note.count;
    state.groupNotifications[target_id].last_added_at = new Date(
      note.last_added_at
    ).getTime();
    state.groupsPosition.push(note.group_id);
  });
  // use the sort to initialize the position of Groups by the lastest notification
  state.groupsPosition = sortByLastAdded(
    state.groupsPosition,
    state.groupNotifications,
    chatType.group
  );

  state.loadingStatus = loadingStatusEnum.getNotifications_succeeded;
}
