import { createAsyncThunk } from "@reduxjs/toolkit";

import { RootState } from "../..";
import { client, serverUrl } from "../../utils";

export const clearNotifications = createAsyncThunk<
  { type: string; id: string },
  { type: string; id: string },
  { state: RootState }
>("message/clearNotifications", async ({ type, id }, thunkAPI) => {
  const user_id = thunkAPI.getState().user.currentUser.user_id;
  await client.post(serverUrl + `/chat/clear-notifications`, {
    type,
    target_id: id,
    user_id,
  });

  return { type, id };
});
