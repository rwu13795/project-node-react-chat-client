import { createAsyncThunk } from "@reduxjs/toolkit";

import { RootState } from "../..";
import { client, serverUrl } from "../../utils";
import { UserState } from "../userSlice";

interface SignUpBody {
  email: string;
  username: string;
  password: string;
  confirm_password: string;
}

export const signUp = createAsyncThunk<
  UserState,
  SignUpBody,
  { state: RootState }
>("user/signUp", async (signUpBody, thunkAPI) => {
  try {
    const response = await client.post(serverUrl + "/auth/sign-up", {
      req_email: signUpBody.email,
      req_username: signUpBody.username,
      req_password: signUpBody.password,
      req_confirm_password: signUpBody.confirm_password,
    });
    return response.data;
  } catch (err: any) {
    // catch the error sent from the server manually, and put it in inside the action.payload
    return thunkAPI.rejectWithValue(err.response.data);
  }
});
