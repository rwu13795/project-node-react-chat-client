import { createAsyncThunk } from "@reduxjs/toolkit";
import { client, serverUrl } from "../../utils";

export const signOut = createAsyncThunk("user/signOut", async () => {
  await client.post(serverUrl + "/auth/sign-out");
  return;
});
