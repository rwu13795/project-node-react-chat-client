import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../..";

import { client, serverUrl } from "../../utils";

interface ChangePW_body {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
}

export const changePassword = createAsyncThunk<
  void,
  ChangePW_body,
  { state: RootState }
>("user/changePassword", async (body, thunkAPI) => {
  try {
    await client.post(serverUrl + `/auth/change-pw`, body);
    return;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});
