import { createAsyncThunk } from "@reduxjs/toolkit";

import { RootState } from "../..";
import { client, serverUrl } from "../../utils";
import { UserState } from "../userSlice";

interface SignInBody {
  email: string;
  password: string;
}

/*  createAsyncThunk types
    1) UserState -- action payload type for the "signIn.fullfilled" and other signIn.xxxxx
       I don't need to put the type in the Payload<> if I have indicate the type here
    2) type of object which is being passed into this dispatch function
    3) { state: RootState } the type for thunkAPI 
*/
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
