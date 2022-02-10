import { createAsyncThunk } from "@reduxjs/toolkit";

import { client, serverUrl } from "../../utils";
import { UserState } from "../userSlice";

export const getUserAuth = createAsyncThunk<
  UserState & { require_initialize: boolean },
  { initialize: boolean }
>("user/getUserAuth", async ({ initialize }) => {
  const response = await client.get<
    UserState & { require_initialize: boolean }
  >(
    serverUrl + `/auth/user-auth-status?initialize=${initialize ? "yes" : "no"}`
  );
  return response.data;
});
