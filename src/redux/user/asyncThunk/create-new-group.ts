import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";

import { RootState } from "../..";
import { axios_client, loadingStatusEnum } from "../../../utils";
import { serverUrl } from "../../utils";
import { Group, UserState } from "../userSlice";

interface Res_body {
  group_name: string;
  admin_user_id: string;
}
interface Payload extends Group {}

export const createNewGroup = createAsyncThunk<
  Payload,
  Res_body,
  { state: RootState }
>("user/createNewGroup", async (body, thunkAPI) => {
  const client = axios_client();

  try {
    const response = await client.post<Payload>(
      serverUrl + `/user/create-new-group`,
      body
    );
    return response.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

export function createNewGroup_fulfilled(
  state: WritableDraft<UserState>,
  action: PayloadAction<Payload>
) {
  state.groupsList[action.payload.group_id] = action.payload;
  state.loadingStatus = loadingStatusEnum.createNewGroup_succeeded;
  state.newGroupToJoin = action.payload.group_id;
}

export function createNewGroup_pending(state: WritableDraft<UserState>) {
  state.loadingStatus = loadingStatusEnum.createNewGroup_loading;
}

export function createNewGroup_rejected(
  state: WritableDraft<UserState>,
  action: PayloadAction<any>
) {
  // each user can only create 5 groups (for demo)
  // the "groups_limit" is the field name
  state.loadingStatus = loadingStatusEnum.failed;
  for (let err of action.payload.errors) {
    state.requestErrors[err.field] = err.message;
  }
}
