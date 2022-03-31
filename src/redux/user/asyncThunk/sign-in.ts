import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";

import { RootState } from "../..";
import { loadingStatusEnum, onlineStatus_enum } from "../../../utils";
import { client, serverUrl } from "../../utils";
import {
  AddFriendRequest,
  CurrentUser,
  Friend,
  Group,
  GroupInvitation,
  UserState,
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

export function signIn_fulfilled(
  state: WritableDraft<UserState>,
  action: PayloadAction<Payload>
) {
  state.currentUser = action.payload.currentUser;
  state.addFriendRequests = action.payload.addFriendRequests;
  state.groupInvitations = action.payload.groupInvitations;

  for (let group of action.payload.groupsList) {
    state.groupsList[group.group_id] = group;
    if (!group.user_left) {
      state.groupsToJoin.push(group.group_id);
    }
  }

  for (let friend of action.payload.friendsList) {
    state.friendsList[friend.friend_id] = friend;
    state.friendsList[friend.friend_id].onlineStatus =
      onlineStatus_enum.offline;
  }
  state.loadingStatus = loadingStatusEnum.idle;
}

export function signIn_pending(state: WritableDraft<UserState>) {
  state.loadingStatus = loadingStatusEnum.loading;
}

export function signIn_rejected(
  state: WritableDraft<UserState>,
  action: PayloadAction<any>
) {
  for (let err of action.payload.errors) {
    state.requestErrors[err.field] = err.message;
  }
  state.loadingStatus = loadingStatusEnum.failed;
}
