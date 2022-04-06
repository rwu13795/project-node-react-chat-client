import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";

import { RootState } from "../..";
import {
  axios_client,
  loadingStatusEnum,
  onlineStatus_enum,
} from "../../../utils";
import { serverUrl } from "../../utils";
import { CurrentUser, Friend, UserState } from "../userSlice";

interface Res_body {
  email: string;
  username: string;
  password: string;
  confirm_password: string;
}

interface Payload {
  currentUser: CurrentUser;
  friendsList: Friend[];
}

export const signUp = createAsyncThunk<Payload, Res_body, { state: RootState }>(
  "user/signUp",
  async (signUpBody, thunkAPI) => {
    const client = axios_client();

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
  }
);

export function signUp_fulfilled(
  state: WritableDraft<UserState>,
  action: PayloadAction<Payload>
) {
  state.currentUser = action.payload.currentUser;
  state.loadingStatus = loadingStatusEnum.idle;

  for (let friend of action.payload.friendsList) {
    state.friendsList[friend.friend_id] = friend;
    state.friendsList[friend.friend_id].onlineStatus =
      onlineStatus_enum.offline;
  }
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
