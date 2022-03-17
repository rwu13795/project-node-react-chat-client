import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../..";

import { client, serverUrl } from "../../utils";
import { Group } from "../userSlice";

interface Res_body {
  group_name: string;
  creator_user_id: string;
}
interface Payload extends Group {}

export const createNewGroup = createAsyncThunk<
  Payload,
  Res_body,
  { state: RootState }
>("user/createNewGroup", async (body, thunkAPI) => {
  try {
    const response = await client.post<Payload>(
      serverUrl + `/user/create-new-group`,
      body
    );
    return response.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});
