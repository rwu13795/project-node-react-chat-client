import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../..";

import { client, serverUrl } from "../../utils";

export const forgotPasswordRequest = createAsyncThunk<
  void,
  { email: string },
  { state: RootState }
>("user/forgotPasswordRequest", async ({ email }, thunkAPI) => {
  try {
    await client.post(serverUrl + `/auth/forgot-pw-request`, {
      email,
    });
    return;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});
