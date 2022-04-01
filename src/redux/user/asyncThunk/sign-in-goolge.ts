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

interface Req_body {
  appearOffline: boolean;
  token: string;
}

interface Payload {
  currentUser: CurrentUser;
  friendsList: Friend[];
  addFriendRequests: AddFriendRequest[];
  groupsList: Group[];
  groupInvitations: GroupInvitation[];
  isNewUser?: boolean;
}

export const signInWithGoogle = createAsyncThunk<
  Payload,
  Req_body,
  { state: RootState }
>("user/SignInWithGoogle", async (body, thunkAPI) => {
  try {
    const response = await client.post<Payload>(
      serverUrl + "/auth/google-sign-in",
      body
    );
    return response.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

export function signInWithGoogle_fulfilled(
  state: WritableDraft<UserState>,
  action: PayloadAction<Payload>
) {
  state.currentUser = action.payload.currentUser;
  for (let friend of action.payload.friendsList) {
    state.friendsList[friend.friend_id] = friend;
    state.friendsList[friend.friend_id].onlineStatus =
      onlineStatus_enum.offline;
  }
  if (action.payload.isNewUser) {
    state.loadingStatus = loadingStatusEnum.idle;
    return;
  }

  state.addFriendRequests = action.payload.addFriendRequests;
  state.groupInvitations = action.payload.groupInvitations;
  for (let group of action.payload.groupsList) {
    state.groupsList[group.group_id] = group;
    if (!group.user_left) {
      state.groupsToJoin.push(group.group_id);
    }
  }

  state.loadingStatus = loadingStatusEnum.idle;
}

export function signInWithGoogle_pending(state: WritableDraft<UserState>) {
  state.loadingStatus = loadingStatusEnum.googleSignIn_loading;
}

export function signInWithGoogle_rejected(
  state: WritableDraft<UserState>,
  action: PayloadAction<any>
) {
  for (let err of action.payload.errors) {
    state.requestErrors[err.field] = err.message;
  }
  state.loadingStatus = loadingStatusEnum.failed;
}
