import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { RootState } from "../..";
import { axios_client, loadingStatusEnum } from "../../../utils";

import { serverUrl } from "../../utils";
import { UserState } from "../userSlice";

interface Res_body {
  email: string;
}

export const forgotPasswordRequest = createAsyncThunk<
  void,
  Res_body,
  { state: RootState }
>("user/forgotPasswordRequest", async (body, thunkAPI) => {
  const client = axios_client();

  try {
    await client.post(serverUrl + `/auth/forgot-pw-request`, body);
    return;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

export function forgotPasswordRequest_fulfilled(
  state: WritableDraft<UserState>
) {
  state.loadingStatus = loadingStatusEnum.succeeded;
}

export function forgotPasswordRequest_pending(state: WritableDraft<UserState>) {
  state.loadingStatus = loadingStatusEnum.loading;
}

export function forgotPasswordRequest_rejected(
  state: WritableDraft<UserState>,
  action: PayloadAction<any>
) {
  state.loadingStatus = loadingStatusEnum.failed;
  for (let err of action.payload.errors) {
    state.requestErrors[err.field] = err.message;
  }
}
