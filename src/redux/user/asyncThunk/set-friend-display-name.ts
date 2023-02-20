import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { RootState } from "../..";
import { AxiosClient, loadingStatusEnum } from "../../../utils";

import { serverUrl } from "../../utils";
import { UserState } from "../userSlice";

interface Req_body {
  friend_id: string;
  friend_display_name: string;
  user_id: string;
}

interface Payload {
  friend_id: string;
  friend_display_name: string;
}

export const setFriendDisplayName = createAsyncThunk<
  Payload,
  Req_body,
  { state: RootState }
>("user/setFriendDisplayName", async (body, thunkAPI) => {
  const client = AxiosClient.getClient();

  try {
    const { data } = await client.post<Payload>(
      serverUrl + `/user/set-friend-display-name`,
      body
    );
    return data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

export function setFriendDisplayName_fulfilled(
  state: WritableDraft<UserState>,
  action: PayloadAction<Payload>
) {
  const { friend_id, friend_display_name } = action.payload;
  state.friendsList[friend_id].friend_display_name = friend_display_name;
  state.loadingStatus = loadingStatusEnum.idle;
}

export function setFriendDisplayName_pending(state: WritableDraft<UserState>) {
  state.loadingStatus = loadingStatusEnum.loading;
}

export function setFriendDisplayName_rejected(
  state: WritableDraft<UserState>,
  action: PayloadAction<any>
) {
  for (let err of action.payload.errors) {
    state.requestErrors[err.field] = err.message;
  }
}
