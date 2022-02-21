import { createAsyncThunk } from "@reduxjs/toolkit";

import { client, serverUrl } from "../../utils";
import { GroupMember } from "../userSlice";

export const getGroupMembersList_database = createAsyncThunk<
  { group_id: string; group_members: GroupMember[] },
  { group_id: string }
>("user/getGroupMembersList", async ({ group_id }) => {
  const response = await client.get<GroupMember[]>(
    serverUrl + `/user/get-members-list?group_id=${group_id}`
  );
  console.log(response.data);

  return { group_id, group_members: response.data };
});
