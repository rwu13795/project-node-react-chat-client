import { createAsyncThunk } from "@reduxjs/toolkit";

import { RootState } from "../..";
import { client, serverUrl } from "../../utils";
import { UserState } from "../userSlice";

interface SignInBody {
  email: string;
  password: string;
}

export const signIn = createAsyncThunk<
  UserState,
  SignInBody,
  { state: RootState }
>(
  "user/signIn",
  async (
    signInBody,
    // NOTE//
    // if you need to customize the contents of the rejected action, you should
    // catch any errors yourself, and then pass that error object from server, using the
    // thunkAPI.rejectWithValue to the reducer
    thunkAPI
  ) => {
    try {
      const response = await client.post<UserState>(
        serverUrl + "/auth/sign-in",
        {
          req_email: signInBody.email,
          req_password: signInBody.password,
        }
      );
      return response.data;
    } catch (err: any) {
      // catch the error sent from the server manually, and put it in inside the action.payload
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);
