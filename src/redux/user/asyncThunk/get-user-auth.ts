import { createAsyncThunk } from "@reduxjs/toolkit";

import { client, serverUrl } from "../../utils";
import { UserState } from "../userSlice";

export const getUserAuth = createAsyncThunk("user/getUserAuth", async () => {
  const response = await client.get<UserState>(
    serverUrl + "/auth/user-auth-status"
  );
  return response.data;
});
