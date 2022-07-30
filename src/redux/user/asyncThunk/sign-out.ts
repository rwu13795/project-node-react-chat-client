import { createAsyncThunk } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { Socket } from "socket.io-client";
import { AxiosClient, loadingStatusEnum } from "../../../utils";
import { serverUrl } from "../../utils";
import { UserState } from "../userSlice";

export const signOut = createAsyncThunk("user/signOut", async () => {
  const client = AxiosClient.getClient();
  await client.post(serverUrl + "/auth/sign-out");

  return;
});

export function signOut_fulfilled(state: WritableDraft<UserState>) {
  // signal the all slices to reset
  state.loadingStatus = loadingStatusEnum.signOut_succeeded;
}
