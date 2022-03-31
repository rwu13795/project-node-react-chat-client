import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";

import { RootState } from "../..";
import { loadingStatusEnum, onlineStatus_enum } from "../../../utils";
import { client, serverUrl } from "../../utils";
import { CurrentUser, UserState } from "../userSlice";

interface Res_body {
  email: string;
  username: string;
  password: string;
  confirm_password: string;
}

interface Payload extends CurrentUser {}

export const signUp = createAsyncThunk<
  CurrentUser,
  Res_body,
  { state: RootState }
>("user/signUp", async (signUpBody, thunkAPI) => {
  try {
    const response = await client.post<Payload>(
      serverUrl + "/auth/sign-up",
      signUpBody
    );
    return response.data;
  } catch (err: any) {
    // catch the error sent from the server manually, and put it in inside the action.payload
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

export function signUp_fulfilled(
  state: WritableDraft<UserState>,
  action: PayloadAction<CurrentUser>
) {
  state.currentUser = action.payload;
  state.currentUser.onlineStatus = onlineStatus_enum.online;
  state.loadingStatus = loadingStatusEnum.idle;
}

export function signUp_pending(state: WritableDraft<UserState>) {
  state.loadingStatus = loadingStatusEnum.loading;
}

export function signUp_rejected(
  state: WritableDraft<UserState>,
  action: PayloadAction<any>
) {
  for (let err of action.payload.errors) {
    state.requestErrors[err.field] = err.message;
  }
  state.loadingStatus = loadingStatusEnum.failed;
}
