import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../..";
import { chatType } from "../../message/messageSlice";

import { client, serverUrl } from "../../utils";
import { GroupMember } from "../userSlice";

export const getGroupMembersList_database = createAsyncThunk<
  {
    group_id: string;
    group_members: GroupMember[];
    wasMembersListLoaded: boolean;
  },
  { group_id: string; initialize: boolean },
  { state: RootState }
>("user/getGroupMembersList", async ({ group_id, initialize }, thunkAPI) => {
  const room_id = `${chatType.group}_${group_id}`;
  // if the room is visited, that means chat history has been loaded, then don't make request again
  if (thunkAPI.getState().message.visitedRoom[room_id] && !initialize) {
    console.log("visied room - not getting member list again");
    return {
      group_id,
      group_members: [],
      wasMembersListLoaded: true,
    };
  }

  const response = await client.get<GroupMember[]>(
    serverUrl + `/user/get-members-list?group_id=${group_id}`
  );
  console.log(response.data);

  return {
    group_id,
    group_members: response.data,
    wasMembersListLoaded: false,
  };
});
