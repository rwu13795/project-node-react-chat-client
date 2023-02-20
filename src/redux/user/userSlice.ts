import { createSelector, createSlice } from "@reduxjs/toolkit";

import type { RootState } from "../index";
import { loadingStatusEnum, onlineStatus_enum } from "../../utils";
import * as asyncThunk from "./asyncThunk";
import * as reducers from "./reducers";
import { InputFields } from "../../components/input-field/InputField";

export interface CurrentUser {
  username: string;
  email: string;
  user_id: string;
  onlineStatus: string;
  avatar_url?: string;
  isLoggedIn?: boolean;
  loggedInWithGoogle?: boolean;
}
export interface RequestErrors extends InputFields {}

export interface AddFriendRequest {
  sender_id: string;
  sender_username: string;
  sender_email: string;
  sender_avatar: string;
  message: string;
}
export interface GroupInvitation {
  group_id: string;
  group_name: string;
  inviter_id: string;
  was_responded: boolean;
  discarded?: boolean;
}

export interface Friend {
  friend_id: string;
  friend_username: string;
  friend_email: string;
  avatar_url?: string;
  friend_display_name?: string;
  user_blocked_friend: boolean;
  user_blocked_friend_at: string;
  friend_blocked_user: boolean;
  friend_blocked_user_at: string;
  onlineStatus: string;
}
export interface GroupMember {
  user_id: string;
  username: string;
  email: string;
  avatar_url?: string;
}

export interface Group {
  group_id: string;
  group_name: string;
  admin_user_id: string;
  user_left: boolean;
  user_left_at: string | null;
  was_kicked: boolean;
  // only load group_members from DB when user enters the group room
  group_members?: GroupMember[];
  wasMembersListLoaded: boolean;
}
export interface FriendsList {
  [friend_id: string]: Friend;
}
export interface GroupsList {
  [group_id: string]: Group;
}

export interface UserState {
  currentUser: CurrentUser;
  // friends
  friendsList: FriendsList;
  addFriendRequests: AddFriendRequest[];
  result_addFriendRequest: string;
  // groups
  groupsList: GroupsList;
  groupsToJoin: string[];
  newGroupToJoin: string;
  groupInvitations: GroupInvitation[];
  result_groupInvitation: string;
  // layout
  loadingStatus: string;
  loadingStatus_2: string;
  requestErrors: RequestErrors;
  openAlertModal_sameUser: boolean;
  openAlertModal_timeOut: boolean;
  openViewProfileModal: boolean;
  viewProfileTarget: GroupMember;
}

export const initialState_user: UserState = {
  currentUser: {
    username: "",
    email: "",
    user_id: "",
    isLoggedIn: undefined,
    onlineStatus: onlineStatus_enum.offline,
  },
  friendsList: {},
  addFriendRequests: [],
  result_addFriendRequest: "",
  groupInvitations: [],
  result_groupInvitation: "",
  groupsList: {},
  groupsToJoin: [],
  newGroupToJoin: "",
  loadingStatus: loadingStatusEnum.idle,
  loadingStatus_2: loadingStatusEnum.idle,
  requestErrors: {},
  openAlertModal_sameUser: false,
  openAlertModal_timeOut: false,
  openViewProfileModal: false,
  viewProfileTarget: { user_id: "", username: "", email: "" },
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState_user,
  reducers: {
    setLoadingStatus_user: reducers.setLoadingStatus_user_reducer,

    setLoadingStatus_2_user: reducers.setLoadingStatus_2_user_reducer,

    setFriendsOnlineStatus: reducers.setFriendsOnlineStatus_reducer,

    setAddFriendRequests: reducers.setAddFriendRequests_reducer,

    clearAddFriendRequests: reducers.clearAddFriendRequests_reducer,

    setResult_addFriendRequest: reducers.setResult_addFriendRequest_reducer,

    setResult_groupInvitation: reducers.setResult_groupInvitation_reducer,

    setGroupInvitation: reducers.setGroupInvitation_reducer,

    deleteGroupInvitation: reducers.deleteGroupInvitation_reducer,

    updateGroupsList: reducers.updateGroupsList_reducer,

    leaveGroup: reducers.leaveGroup_reducer,

    clearLeftMember: reducers.clearLeftMember_reducer,

    removeGroup: reducers.removeGroup_reducer,

    setBlockFriend: reducers.setBlockFriend_reducer,

    setUserOnlineStatus: reducers.setUserOnlineStatus_reducer,

    changeAvatar: reducers.changeAvatar_reducer,

    clearRequestError: reducers.clearRequestError_reducer,

    setIsLoggedIn: reducers.setIsLoggedIn_reducer,

    updateGroupAdmin: reducers.updateGroupAdmin_reducer,

    resetAfterSignOut_user: reducers.resetAfterSignOut_user_reducer,

    setOpenAlertModal_sameUser: reducers.setOpenAlertModal_sameUser_reducer,

    setOpenAlertModal_timeOut: reducers.setOpenAlertModal_timeOut_reducer,

    setFriendNewName: reducers.setFriendNewName_reducer,

    setFriendNewAvatar: reducers.setFriendNewAvatar_reducer,

    setViewProfileTarget: reducers.setViewProfileTarget_reducer,

    setOpenViewProfileModal: reducers.setOpenViewProfileModal_reducer,
  },

  extraReducers: (builder) => {
    builder
      /***************  GET AUTH  ***************/
      .addCase(
        asyncThunk.getUserAuth.fulfilled,
        asyncThunk.getUserAuth_fulfilled
      )

      /***************  SIGN IN  ***************/
      .addCase(asyncThunk.signIn.fulfilled, asyncThunk.signIn_fulfilled)
      .addCase(asyncThunk.signIn.pending, asyncThunk.signIn_pending)
      .addCase(asyncThunk.signIn.rejected, asyncThunk.signIn_rejected)

      /***************  SIGN UP  ***************/
      .addCase(asyncThunk.signUp.fulfilled, asyncThunk.signUp_fulfilled)
      .addCase(asyncThunk.signUp.pending, asyncThunk.signUp_pending)
      .addCase(asyncThunk.signUp.rejected, asyncThunk.signUp_rejected)

      /***************  SIGN OUT  ***************/
      .addCase(asyncThunk.signOut.fulfilled, asyncThunk.signOut_fulfilled)

      /***************  CREATE A NEW GROUP  ***************/
      .addCase(
        asyncThunk.createNewGroup.fulfilled,
        asyncThunk.createNewGroup_fulfilled
      )
      .addCase(
        asyncThunk.createNewGroup.pending,
        asyncThunk.createNewGroup_pending
      )
      .addCase(
        asyncThunk.createNewGroup.rejected,
        asyncThunk.createNewGroup_rejected
      )

      /***************  GET GROUP MEMBERS  ***************/
      .addCase(
        asyncThunk.getGroupMembersList_database.fulfilled,
        asyncThunk.getGroupMembersList_database_fulfilled
      )

      /***************  FORGOT PASSWORD REQUEST  ***************/
      .addCase(
        asyncThunk.forgotPasswordRequest.fulfilled,
        asyncThunk.forgotPasswordRequest_fulfilled
      )
      .addCase(
        asyncThunk.forgotPasswordRequest.pending,
        asyncThunk.forgotPasswordRequest_pending
      )
      .addCase(
        asyncThunk.forgotPasswordRequest.rejected,
        asyncThunk.forgotPasswordRequest_rejected
      )

      /***************  FORGOT PASSWORD RESET  ***************/
      .addCase(
        asyncThunk.forgotPasswordReset.fulfilled,
        asyncThunk.forgotPasswordReset_fulfilled
      )
      .addCase(
        asyncThunk.forgotPasswordReset.pending,
        asyncThunk.forgotPasswordReset_pending
      )
      .addCase(
        asyncThunk.forgotPasswordReset.rejected,
        asyncThunk.forgotPasswordReset_rejected
      )

      /***************  CHANGE PASSWORD  ***************/
      .addCase(
        asyncThunk.changePassword.fulfilled,
        asyncThunk.changePassword_fulfilled
      )
      .addCase(
        asyncThunk.changePassword.pending,
        asyncThunk.changePassword_pending
      )
      .addCase(
        asyncThunk.changePassword.rejected,
        asyncThunk.changePassword_rejected
      )

      /***************  CHANGE USERNAME  ***************/
      .addCase(
        asyncThunk.changeUsername.fulfilled,
        asyncThunk.changeUsername_fulfilled
      )
      .addCase(
        asyncThunk.changeUsername.pending,
        asyncThunk.changeUsername_pending
      )
      .addCase(
        asyncThunk.changeUsername.rejected,
        asyncThunk.changeUsername_rejected
      )

      /***************  GOOGLE SIGN IN  ***************/
      .addCase(
        asyncThunk.signInWithGoogle.fulfilled,
        asyncThunk.signInWithGoogle_fulfilled
      )
      .addCase(
        asyncThunk.signInWithGoogle.pending,
        asyncThunk.signInWithGoogle_pending
      )
      .addCase(
        asyncThunk.signInWithGoogle.rejected,
        asyncThunk.signInWithGoogle_rejected
      )

      /***************  CHANGE GROUP NAME  ***************/
      .addCase(
        asyncThunk.changeGroupName.fulfilled,
        asyncThunk.changeGroupName_fulfilled
      )
      .addCase(
        asyncThunk.changeGroupName.pending,
        asyncThunk.changeGroupName_pending
      )
      .addCase(
        asyncThunk.changeGroupName.rejected,
        asyncThunk.changeGroupName_rejected
      )

      /***************  SET FRIEND DISPLAY NAME  ***************/
      .addCase(
        asyncThunk.setFriendDisplayName.fulfilled,
        asyncThunk.setFriendDisplayName_fulfilled
      )
      .addCase(
        asyncThunk.setFriendDisplayName.pending,
        asyncThunk.setFriendDisplayName_pending
      )
      .addCase(
        asyncThunk.setFriendDisplayName.rejected,
        asyncThunk.setFriendDisplayName_rejected
      );
  },
});

export const {
  setLoadingStatus_user,
  setLoadingStatus_2_user,
  setFriendsOnlineStatus,
  setAddFriendRequests,
  clearAddFriendRequests,
  setResult_addFriendRequest,
  setResult_groupInvitation,
  setGroupInvitation,
  deleteGroupInvitation,
  updateGroupsList,
  leaveGroup,
  clearLeftMember,
  removeGroup,
  setBlockFriend,
  setUserOnlineStatus,
  changeAvatar,
  clearRequestError,
  setIsLoggedIn,
  updateGroupAdmin,
  resetAfterSignOut_user,
  setOpenAlertModal_sameUser,
  setOpenAlertModal_timeOut,
  setFriendNewName,
  setFriendNewAvatar,
  setOpenViewProfileModal,
  setViewProfileTarget,
} = userSlice.actions;

export default userSlice.reducer;

// NOTE from Redux Docs //
// In typical Reselect usage, you write your top-level "input selectors" as plain functions,
// and use createSelector to create memoized selectors that look up nested value
const selectUser = (state: RootState) => state.user;
export const selectCurrentUser = createSelector(
  [selectUser],
  (userState) => userState.currentUser
);
export const selectIsLoggedIn = createSelector(
  [selectCurrentUser],
  (currentUser) => currentUser.isLoggedIn
);
export const selectUserId = createSelector(
  [selectCurrentUser],
  (currentUser) => currentUser.user_id
);
export const selectUsername = createSelector(
  [selectCurrentUser],
  (currentUser) => currentUser.username
);
export const selectUserEmail = createSelector(
  [selectCurrentUser],
  (currentUser) => currentUser.email
);
export const selectUserOnlineStatus = createSelector(
  [selectCurrentUser],
  (currentUser) => currentUser.onlineStatus
);

export const selectFriendsList = createSelector(
  [selectUser],
  (userState) => userState.friendsList
);

export const selectAddFriendRequests = createSelector(
  [selectUser],
  (userState) => userState.addFriendRequests
);
export const selectRequestErrors = createSelector(
  [selectUser],
  (userState) => userState.requestErrors
);
export const selectResult_addFriendRequest = createSelector(
  [selectUser],
  (userState) => userState.result_addFriendRequest
);
export const selectResult_groupInvitation = createSelector(
  [selectUser],
  (userState) => userState.result_groupInvitation
);

export const selectGroupsList = createSelector(
  [selectUser],
  (userState) => userState.groupsList
);
export const selectGroupInvitations = createSelector(
  [selectUser],
  (userState) => userState.groupInvitations
);

export const selectTargetGroup = (group_id: string) =>
  createSelector([selectGroupsList], (groups) => groups[group_id]);
export const selectTargetFriend = (friend_id: string) =>
  createSelector([selectFriendsList], (friends) => friends[friend_id]);

export const selectTargetGroupMembers = (group_id: string) => {
  return createSelector([selectGroupsList], (groups) => {
    if (groups[group_id] && groups[group_id].group_members) {
      const membersList: { [member_id: string]: GroupMember } = {};

      for (let member of groups[group_id].group_members!) {
        membersList[member.user_id] = member;
      }
      return membersList;
    } else {
      return {};
    }
  });
};

export const selectGroupsToJoin = createSelector(
  [selectUser],
  (userState) => userState.groupsToJoin
);
export const selectNewGroupToJoin = createSelector(
  [selectUser],
  (userState) => userState.newGroupToJoin
);
export const selectLoadingStatus_user = createSelector(
  [selectUser],
  (userState) => userState.loadingStatus
);
export const selectLoadingStatus_2_user = createSelector(
  [selectUser],
  (userState) => userState.loadingStatus_2
);

export const selectOpenAlertModal_sameUser = createSelector(
  [selectUser],
  (userState) => userState.openAlertModal_sameUser
);
export const selectOpenAlertModal_timeOut = createSelector(
  [selectUser],
  (userState) => userState.openAlertModal_timeOut
);

export const selectOpenViewProfileModal = createSelector(
  [selectUser],
  (userState) => userState.openViewProfileModal
);
export const selectViewProfileTarget = createSelector(
  [selectUser],
  (userState) => userState.viewProfileTarget
);
