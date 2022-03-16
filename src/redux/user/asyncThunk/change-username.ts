import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../..";

import { client, serverUrl } from "../../utils";

interface changeUsername_body {
  username: string;
}

export const changeUsername = createAsyncThunk<
  { username: string },
  changeUsername_body,
  { state: RootState }
>("user/changeUsername", async (body, thunkAPI) => {
  try {
    const { data } = await client.post<{ username: string }>(
      serverUrl + `/auth/change-username`,
      body
    );
    return data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});
