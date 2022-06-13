import { createSelector, createSlice } from "@reduxjs/toolkit";

import type { RootState } from "../index";
import { loadingStatusEnum, onlineStatus_enum } from "../../utils";
import {
  changeGroupName,
  changeGroupName_fulfilled,
  changeGroupName_pending,
  changeGroupName_rejected,
  changePassword,
  changePassword_fulfilled,
  changePassword_pending,
  changePassword_rejected,
  changeUsername,
  changeUsername_fulfilled,
  changeUsername_pending,
  changeUsername_rejected,
  createNewGroup,
  createNewGroup_fulfilled,
  createNewGroup_pending,
  createNewGroup_rejected,
  forgotPasswordRequest,
  forgotPasswordRequest_fulfilled,
  forgotPasswordRequest_pending,
  forgotPasswordRequest_rejected,
  forgotPasswordReset,
  forgotPasswordReset_fulfilled,
  forgotPasswordReset_pending,
  forgotPasswordReset_rejected,
  getGroupMembersList_database,
  getGroupMembersList_database_fulfilled,
  getUserAuth,
  getUserAuth_fulfilled,
  setFriendDisplayName,
  setFriendDisplayName_fulfilled,
  setFriendDisplayName_pending,
  setFriendDisplayName_rejected,
  signIn,
  signInWithGoogle,
  signInWithGoogle_fulfilled,
  signInWithGoogle_pending,
  signInWithGoogle_rejected,
  signIn_fulfilled,
  signIn_pending,
  signIn_rejected,
  signOut,
  signOut_fulfilled,
  signUp,
  signUp_fulfilled,
  signUp_pending,
  signUp_rejected,
} from "./asyncThunk";
import {
  changeAvatar_reducer,
  clearAddFriendRequests_reducer,
  clearLeftMember_reducer,
  clearRequestError_reducer,
  leaveGroup_reducer,
  removeGroup_reducer,
  deleteGroupInvitation_reducer,
  setAddFriendRequests_reducer,
  setBlockFriend_reducer,
  setFriendsOnlineStatus_reducer,
  setGroupInvitation_reducer,
  setIsLoggedIn_reducer,
  setLoadingStatus_user_reducer,
  setLoadingStatus_2_user_reducer,
  setResult_addFriendRequest_reducer,
  setResult_groupInvitation_reducer,
  setUserOnlineStatus_reducer,
  updateGroupAdmin_reducer,
  updateGroupsList_reducer,
  resetAfterSignOut_user_reducer,
  setOpenAlertModal_sameUser_reducer,
  setOpenAlertModal_timeOut_reducer,
  setFriendNewName_reducer,
  setViewProfileTarget_reducer,
  setOpenViewProfileModal_reducer,
} from "./reducers";
import { InputFields } from "../../components/input-field/InputField";
import { setFriendNewAvatar_reducer } from "./reducers/setFriendNewAvatar";

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
  groupsArray: Group[];
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
  groupsArray: [],
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
    setLoadingStatus_user: setLoadingStatus_user_reducer,

    setLoadingStatus_2_user: setLoadingStatus_2_user_reducer,

    setFriendsOnlineStatus: setFriendsOnlineStatus_reducer,

    setAddFriendRequests: setAddFriendRequests_reducer,

    clearAddFriendRequests: clearAddFriendRequests_reducer,

    setResult_addFriendRequest: setResult_addFriendRequest_reducer,

    setResult_groupInvitation: setResult_groupInvitation_reducer,

    setGroupInvitation: setGroupInvitation_reducer,

    deleteGroupInvitation: deleteGroupInvitation_reducer,

    updateGroupsList: updateGroupsList_reducer,

    leaveGroup: leaveGroup_reducer,

    clearLeftMember: clearLeftMember_reducer,

    removeGroup: removeGroup_reducer,

    setBlockFriend: setBlockFriend_reducer,

    setUserOnlineStatus: setUserOnlineStatus_reducer,

    changeAvatar: changeAvatar_reducer,

    clearRequestError: clearRequestError_reducer,

    setIsLoggedIn: setIsLoggedIn_reducer,

    updateGroupAdmin: updateGroupAdmin_reducer,

    resetAfterSignOut_user: resetAfterSignOut_user_reducer,

    setOpenAlertModal_sameUser: setOpenAlertModal_sameUser_reducer,

    setOpenAlertModal_timeOut: setOpenAlertModal_timeOut_reducer,

    setFriendNewName: setFriendNewName_reducer,

    setFriendNewAvatar: setFriendNewAvatar_reducer,

    setViewProfileTarget: setViewProfileTarget_reducer,

    setOpenViewProfileModal: setOpenViewProfileModal_reducer,
  },

  extraReducers: (builder) => {
    builder
      /***************  GET AUTH  ***************/
      .addCase(getUserAuth.fulfilled, getUserAuth_fulfilled)

      /***************  SIGN IN  ***************/
      .addCase(signIn.fulfilled, signIn_fulfilled)
      .addCase(signIn.pending, signIn_pending)
      .addCase(signIn.rejected, signIn_rejected)

      /***************  SIGN UP  ***************/
      .addCase(signUp.fulfilled, signUp_fulfilled)
      .addCase(signUp.pending, signUp_pending)
      .addCase(signUp.rejected, signUp_rejected)

      /***************  SIGN OUT  ***************/
      .addCase(signOut.fulfilled, signOut_fulfilled)

      /***************  CREATE A NEW GROUP  ***************/
      .addCase(createNewGroup.fulfilled, createNewGroup_fulfilled)
      .addCase(createNewGroup.pending, createNewGroup_pending)
      .addCase(createNewGroup.rejected, createNewGroup_rejected)

      /***************  GET GROUP MEMBERS  ***************/
      .addCase(
        getGroupMembersList_database.fulfilled,
        getGroupMembersList_database_fulfilled
      )

      /***************  FORGOT PASSWORD REQUEST  ***************/
      .addCase(forgotPasswordRequest.fulfilled, forgotPasswordRequest_fulfilled)
      .addCase(forgotPasswordRequest.pending, forgotPasswordRequest_pending)
      .addCase(forgotPasswordRequest.rejected, forgotPasswordRequest_rejected)

      /***************  FORGOT PASSWORD RESET  ***************/
      .addCase(forgotPasswordReset.fulfilled, forgotPasswordReset_fulfilled)
      .addCase(forgotPasswordReset.pending, forgotPasswordReset_pending)
      .addCase(forgotPasswordReset.rejected, forgotPasswordReset_rejected)

      /***************  CHANGE PASSWORD  ***************/
      .addCase(changePassword.fulfilled, changePassword_fulfilled)
      .addCase(changePassword.pending, changePassword_pending)
      .addCase(changePassword.rejected, changePassword_rejected)

      /***************  CHANGE USERNAME  ***************/
      .addCase(changeUsername.fulfilled, changeUsername_fulfilled)
      .addCase(changeUsername.pending, changeUsername_pending)
      .addCase(changeUsername.rejected, changeUsername_rejected)

      /***************  GOOGLE SIGN IN  ***************/
      .addCase(signInWithGoogle.fulfilled, signInWithGoogle_fulfilled)
      .addCase(signInWithGoogle.pending, signInWithGoogle_pending)
      .addCase(signInWithGoogle.rejected, signInWithGoogle_rejected)

      /***************  CHANGE GROUP NAME  ***************/
      .addCase(changeGroupName.fulfilled, changeGroupName_fulfilled)
      .addCase(changeGroupName.pending, changeGroupName_pending)
      .addCase(changeGroupName.rejected, changeGroupName_rejected)

      /***************  SET FRIEND DISPLAY NAME  ***************/
      .addCase(setFriendDisplayName.fulfilled, setFriendDisplayName_fulfilled)
      .addCase(setFriendDisplayName.pending, setFriendDisplayName_pending)
      .addCase(setFriendDisplayName.rejected, setFriendDisplayName_rejected);
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

export const selectGroupsArray = createSelector(
  [selectUser],
  (userState) => userState.groupsArray
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
