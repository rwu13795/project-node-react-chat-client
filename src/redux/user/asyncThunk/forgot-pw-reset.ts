import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { RootState } from "../..";
import { axios_client, loadingStatusEnum } from "../../../utils";

import { serverUrl } from "../../utils";
import { UserState } from "../userSlice";

interface Res_body {
  token: string;
  user_id: string;
  new_password: string;
  confirm_new_password: string;
}

export const forgotPasswordReset = createAsyncThunk<
  void,
  Res_body,
  { state: RootState }
>("user/forgotPasswordReset", async (body, thunkAPI) => {
  const client = axios_client();

  try {
    await client.post(serverUrl + `/auth/reset-pw`, body);
    return;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

export function forgotPasswordReset_fulfilled(state: WritableDraft<UserState>) {
  state.loadingStatus = loadingStatusEnum.succeeded;
}

export function forgotPasswordReset_pending(state: WritableDraft<UserState>) {
  state.loadingStatus = loadingStatusEnum.loading;
}

export function forgotPasswordReset_rejected(
  state: WritableDraft<UserState>,
  action: PayloadAction<any>
) {
  for (let err of action.payload.errors) {
    state.requestErrors[err.field] = err.message;
    if (err.field === "expired_link") {
      state.loadingStatus = loadingStatusEnum.time_out;
    }
  }
  if (state.loadingStatus !== loadingStatusEnum.time_out) {
    state.loadingStatus = loadingStatusEnum.failed;
  }
}
