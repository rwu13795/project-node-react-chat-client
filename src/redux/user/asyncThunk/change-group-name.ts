import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { RootState } from "../..";
import { loadingStatusEnum } from "../../../utils";

import { client, serverUrl } from "../../utils";
import { UserState } from "../userSlice";

interface Req_body {
  new_group_name: string;
  group_id: string;
}

interface Payload {
  new_group_name: string;
  group_id: string;
}

export const changeGroupName = createAsyncThunk<
  Payload,
  Req_body,
  { state: RootState }
>("user/changeGroupName", async (body, thunkAPI) => {
  try {
    const { data } = await client.post<Payload>(
      serverUrl + `/user/change-group-name`,
      body
    );
    return data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

export function changeGroupName_fulfilled(
  state: WritableDraft<UserState>,
  action: PayloadAction<Payload>
) {
  const { group_id, new_group_name } = action.payload;
  state.groupsList[group_id].group_name = new_group_name;
  state.loadingStatus = loadingStatusEnum.succeeded;
}

export function changeGroupName_pending(state: WritableDraft<UserState>) {
  state.loadingStatus = loadingStatusEnum.loading;
}

export function changeGroupName_rejected(
  state: WritableDraft<UserState>,
  action: PayloadAction<any>
) {
  for (let err of action.payload.errors) {
    state.requestErrors[err.field] = err.message;
  }
}
