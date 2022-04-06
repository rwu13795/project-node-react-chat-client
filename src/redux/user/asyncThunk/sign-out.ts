import { createAsyncThunk } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { axios_client, loadingStatusEnum } from "../../../utils";
import { serverUrl } from "../../utils";
import { initialState_user, UserState } from "../userSlice";

export const signOut = createAsyncThunk("user/signOut", async () => {
  const client = axios_client();
  await client.post(serverUrl + "/auth/sign-out");
  return;
});

export function signOut_fulfilled(state: WritableDraft<UserState>) {
  // resetting the "state" directly using state = initialState does NOT work
  state.currentUser = initialState_user.currentUser;
  state.friendsList = initialState_user.friendsList;
  state.addFriendRequests = initialState_user.addFriendRequests;
  state.result_addFriendRequest = initialState_user.result_addFriendRequest;
  state.groupInvitations = initialState_user.groupInvitations;
  state.result_groupInvitation = initialState_user.result_groupInvitation;
  state.groupsList = initialState_user.groupsList;
  state.groupsToJoin = initialState_user.groupsToJoin;
  state.newGroupToJoin = initialState_user.newGroupToJoin;
  state.requestErrors = initialState_user.requestErrors;
  state.friendsArray = [];
  state.groupsArray = [];
  // signal the messageSlice to reset
  state.loadingStatus = loadingStatusEnum.signOut_succeeded;
}
