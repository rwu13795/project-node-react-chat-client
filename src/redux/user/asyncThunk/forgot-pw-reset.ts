import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../..";

import { client, serverUrl } from "../../utils";

interface ResetPW_body {
  token: string;
  user_id: string;
  new_password: string;
  confirm_new_password: string;
}

export const forgotPasswordReset = createAsyncThunk<
  void,
  ResetPW_body,
  { state: RootState }
>("user/forgotPasswordReset", async (body, thunkAPI) => {
  try {
    await client.post(serverUrl + `/auth/reset-pw`, body);
    return;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});
