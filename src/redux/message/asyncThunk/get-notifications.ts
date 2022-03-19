import { createAsyncThunk } from "@reduxjs/toolkit";

import { RootState } from "../..";
import { client, serverUrl } from "../../utils";

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

  console.log("response.data notification", response.data);

  return response.data;
});
