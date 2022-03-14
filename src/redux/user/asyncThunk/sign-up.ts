import { createAsyncThunk } from "@reduxjs/toolkit";

import { RootState } from "../..";
import { client, serverUrl } from "../../utils";
import { CurrentUser } from "../userSlice";

interface SignUpBody {
  email: string;
  username: string;
  password: string;
  confirm_password: string;
}

export const signUp = createAsyncThunk<
  CurrentUser,
  SignUpBody,
  { state: RootState }
>("user/signUp", async (signUpBody, thunkAPI) => {
  try {
    const response = await client.post<CurrentUser>(
      serverUrl + "/auth/sign-up",
      signUpBody
    );
    return response.data;
  } catch (err: any) {
    // catch the error sent from the server manually, and put it in inside the action.payload
    return thunkAPI.rejectWithValue(err.response.data);
  }
});
