import { createAsyncThunk } from "@reduxjs/toolkit";

import { RootState } from "../..";
import { client, serverUrl } from "../../utils";
import { CurrentUser } from "../userSlice";

interface Res_body {
  email: string;
  username: string;
  password: string;
  confirm_password: string;
}

interface Payload extends CurrentUser {}

export const signUp = createAsyncThunk<
  CurrentUser,
  Res_body,
  { state: RootState }
>("user/signUp", async (signUpBody, thunkAPI) => {
  try {
    const response = await client.post<Payload>(
      serverUrl + "/auth/sign-up",
      signUpBody
    );
    return response.data;
  } catch (err: any) {
    // catch the error sent from the server manually, and put it in inside the action.payload
    return thunkAPI.rejectWithValue(err.response.data);
  }
});
