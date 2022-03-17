import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../..";

import { client, serverUrl } from "../../utils";

interface Res_body {
  email: string;
}

export const forgotPasswordRequest = createAsyncThunk<
  void,
  Res_body,
  { state: RootState }
>("user/forgotPasswordRequest", async (body, thunkAPI) => {
  try {
    await client.post(serverUrl + `/auth/forgot-pw-request`, body);
    return;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});
