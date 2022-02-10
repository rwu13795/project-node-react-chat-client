import { createAsyncThunk } from "@reduxjs/toolkit";

import { RootState } from "../..";
import { client, serverUrl } from "../../utils";

interface PrivateNotifications {
  sender_id: string;
  count: number;
}
interface GetNotifications_res {
  private: PrivateNotifications[];
  group: string[];
}

export const getNotifications = createAsyncThunk<
  GetNotifications_res,
  string,
  { state: RootState }
>("message/getNotifications", async (currentUserId) => {
  const response = await client.get<GetNotifications_res>(
    serverUrl + `/chat/get-notifications?user_id=${currentUserId}`
  );
  return response.data;
});
