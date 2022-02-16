import { createAsyncThunk } from "@reduxjs/toolkit";

import { client, serverUrl } from "../../utils";
import { Group } from "../userSlice";

export const createNewGroup = createAsyncThunk<
  Group,
  { group_name: string; creator_user_id: string }
>("user/createNewGroup", async ({ group_name, creator_user_id }) => {
  const response = await client.post<Group>(
    serverUrl + `/user/create-new-group`,
    { group_name, creator_user_id }
  );
  return response.data;
});
