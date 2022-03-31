import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";

import { RootState } from "../..";
import { client, serverUrl } from "../../utils";
import { chatType, MessageState } from "../messageSlice";

interface Res_body {
  previousRoom_id: string;
  previousRoom_type: string;
  nextRoom_id: string;
  nextRoom_type: string;
}
interface Payload {
  id: string;
  type: string;
}

export const clearNotifications = createAsyncThunk<
  Payload,
  Res_body,
  { state: RootState }
>(
  "message/clearNotifications",
  async (
    { previousRoom_id, previousRoom_type, nextRoom_id, nextRoom_type },
    thunkAPI
  ) => {
    if (previousRoom_id !== "" && previousRoom_type !== "") {
      const user_id = thunkAPI.getState().user.currentUser.user_id;
      await client.post(serverUrl + `/chat/clear-notifications`, {
        type: previousRoom_type,
        target_id: previousRoom_id,
        user_id,
      });
    }
    // return the type and id to reducer, to clear the counts in local store
    return { type: nextRoom_type, id: nextRoom_id };
  }
);

export function clearNotifications_fulfilled(
  state: WritableDraft<MessageState>,
  action: PayloadAction<Payload>
) {
  const { type, id } = action.payload;
  if (type === chatType.group) {
    if (!state.groupNotifications[`${type}_${id}`]) return;
    state.groupNotifications[`${type}_${id}`].count = 0;
  } else {
    if (!state.friendNotifications[`${type}_${id}`]) return;
    state.friendNotifications[`${type}_${id}`].count = 0;
  }
}
