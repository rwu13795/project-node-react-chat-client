import { WritableDraft } from "immer/dist/internal";
import { initialState_user, UserState } from "../userSlice";

export function resetAfterSignOut_user_reducer(
  state: WritableDraft<UserState>
) {
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
}
