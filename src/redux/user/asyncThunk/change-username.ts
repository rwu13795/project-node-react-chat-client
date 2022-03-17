import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../..";

import { client, serverUrl } from "../../utils";

interface Res_body {
  username: string;
}

interface Payload {
  username: string;
}

export const changeUsername = createAsyncThunk<
  Payload,
  Res_body,
  { state: RootState }
>("user/changeUsername", async (body, thunkAPI) => {
  try {
    const { data } = await client.post<Payload>(
      serverUrl + `/auth/change-username`,
      body
    );
    return data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});
