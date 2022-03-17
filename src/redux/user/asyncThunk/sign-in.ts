import { createAsyncThunk } from "@reduxjs/toolkit";

import { RootState } from "../..";
import { client, serverUrl } from "../../utils";
import {
  AddFriendRequest,
  CurrentUser,
  Friend,
  Group,
  GroupInvitation,
} from "../userSlice";

interface SignIn_body {
  email: string;
  password: string;
  appearOffline: boolean;
}

interface Payload {
  currentUser: CurrentUser;
  friendsList: Friend[];
  addFriendRequests: AddFriendRequest[];
  groupsList: Group[];
  groupInvitations: GroupInvitation[];
}

/*  createAsyncThunk types
    1) Payload -- action payload type for the "signIn.fullfilled" and other signIn.xxxxx
       I don't need to put the type in the Payload<> if I have indicate the type here
    2) type of the object which is being passed into this dispatch function
    3) { state: RootState } the type for thunkAPI 
*/
export const signIn = createAsyncThunk<
  Payload,
  SignIn_body,
  { state: RootState }
>(
  "user/signIn",
  async (
    body,
    // NOTE//
    // if you need to customize the contents of the rejected action, you should
    // catch any errors yourself, and then pass that error object from server, using the
    // thunkAPI.rejectWithValue to the reducer
    thunkAPI
  ) => {
    try {
      const response = await client.post<Payload>(serverUrl + "/auth/sign-in", {
        req_email: body.email,
        req_password: body.password,
        appearOffline: body.appearOffline,
      });
      return response.data;
    } catch (err: any) {
      // catch the error sent from the server manually, and put it in inside the action.payload
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);
