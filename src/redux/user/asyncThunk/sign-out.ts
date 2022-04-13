import { createAsyncThunk } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { axios_client, loadingStatusEnum } from "../../../utils";
import { serverUrl } from "../../utils";
import { initialState_user, UserState } from "../userSlice";

export const signOut = createAsyncThunk("user/signOut", async () => {
  const client = axios_client();
  await client.post(serverUrl + "/auth/sign-out");
  return;
});

export function signOut_fulfilled(state: WritableDraft<UserState>) {
  // signal the all slices to reset
  state.loadingStatus = loadingStatusEnum.signOut_succeeded;
}
