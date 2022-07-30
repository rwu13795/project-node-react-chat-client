import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { RootState } from "../..";
import { AxiosClient, loadingStatusEnum } from "../../../utils";

import { serverUrl } from "../../utils";
import { UserState } from "../userSlice";

interface Req_body {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
}

export const changePassword = createAsyncThunk<
  void,
  Req_body,
  { state: RootState }
>("user/changePassword", async (body, thunkAPI) => {
  const client = AxiosClient.getClient();

  try {
    await client.post(serverUrl + `/auth/change-pw`, body);
    return;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

export function changePassword_fulfilled(state: WritableDraft<UserState>) {
  state.loadingStatus = loadingStatusEnum.resetPW_succeeded;
}

export function changePassword_pending(state: WritableDraft<UserState>) {
  state.loadingStatus = loadingStatusEnum.resetPW_loading;
}

export function changePassword_rejected(
  state: WritableDraft<UserState>,
  action: PayloadAction<any>
) {
  for (let err of action.payload.errors) {
    state.requestErrors[err.field] = err.message;
  }
  state.loadingStatus = loadingStatusEnum.resetPW_failed;
}
