import { createAsyncThunk } from "@reduxjs/toolkit";

import { RootState } from "../..";
import { client, serverUrl } from "../../utils";

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
