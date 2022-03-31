import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { RootState } from "../..";
import { chatType } from "../../message/messageSlice";

import { client, serverUrl } from "../../utils";
import { GroupMember, UserState } from "../userSlice";

interface Req_body {
  group_id: string;
  initialize: boolean;
}

interface Payload {
  group_id: string;
  group_members: GroupMember[];
  wasMembersListLoaded: boolean;
}

export const getGroupMembersList_database = createAsyncThunk<
  Payload,
  Req_body,
  { state: RootState }
>("user/getGroupMembersList", async ({ group_id, initialize }, thunkAPI) => {
  const room_id = `${chatType.group}_${group_id}`;
  // if the room is visited, that means chat history has been loaded,
  // then don't make request again
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

export function getGroupMembersList_database_fulfilled(
  state: WritableDraft<UserState>,
  action: PayloadAction<Payload>
) {
  const { group_id, group_members, wasMembersListLoaded } = action.payload;
  if (wasMembersListLoaded) return;

  state.groupsList[group_id].group_members = group_members;
  state.groupsList[group_id].wasMembersListLoaded = true;
  // state.loadingStatus = "succeeded";
}
