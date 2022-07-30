import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { RootState } from "../..";
import { AxiosClient, loadingStatusEnum } from "../../../utils";

import { serverUrl } from "../../utils";
import { UserState } from "../userSlice";

interface Req_body {
  username: string;
}

interface Payload {
  username: string;
}

export const changeUsername = createAsyncThunk<
  Payload,
  Req_body,
  { state: RootState }
>("user/changeUsername", async (body, thunkAPI) => {
  const client = AxiosClient.getClient();

  try {
    const { data } = await client.post<Payload>(
      serverUrl + `/auth/change-username`,
      body
    );
    return data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

export function changeUsername_fulfilled(
  state: WritableDraft<UserState>,
  action: PayloadAction<Payload>
) {
  state.currentUser.username = action.payload.username;
  state.loadingStatus = loadingStatusEnum.changeUsername_succeeded;
}

export function changeUsername_pending(state: WritableDraft<UserState>) {
  state.loadingStatus = loadingStatusEnum.loading;
}

export function changeUsername_rejected(
  state: WritableDraft<UserState>,
  action: PayloadAction<any>
) {
  for (let err of action.payload.errors) {
    state.requestErrors[err.field] = err.message;
  }
}
