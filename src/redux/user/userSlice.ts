import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../index";
import { inputNames, loadingStatusEnum } from "../../utils";
import {
  changePassword,
  changeUsername,
  createNewGroup,
  forgotPasswordRequest,
  forgotPasswordReset,
  getGroupMembersList_database,
  getUserAuth,
  signIn,
  signOut,
  signUp,
} from "./asyncThunk";

export enum onlineStatus_enum {
  online = "Online",
  away = "Away",
  busy = "Busy",
  offline = "Offline",
}

export interface CurrentUser {
  username: string;
  email: string;
  user_id: string;
  avatar_url?: string;
  isLoggedIn?: boolean;
  onlineStatus: string;
}
export interface RequestErrors {
  [inputField: string]: string;
}
export interface AddFriendRequest {
  sender_id: string;
  sender_username: string;
  sender_email: string;
  message: string;
}
export interface GroupInvitation {
  group_id: string;
  group_name: string;
  inviter_name: string;
  was_responded: boolean;
}

export interface Friend {
  friend_id: string;
  friend_username: string;
  friend_email: string;
  avatar_url?: string;
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
  creator_user_id: string;
  user_left: boolean;
  user_left_at: string | null;
  was_kicked: boolean;
  // only load group_members from DB when user enters the group room
  group_members?: GroupMember[];
  wasMembersListLoaded: boolean;
}

export interface UserState {
  currentUser: CurrentUser;
  // friends
  friendsList: { [friend_id: string]: Friend };
  // friendsOnlineStatus: { [friend_id: string]: boolean };
  addFriendRequests: AddFriendRequest[];
  result_addFriendRequest: string;
  // groups
  groupsList: { [group_id: string]: Group };
  groupsToJoin: string[];
  newGroupToJoin: string;
  createGroupError: string;
  groupInvitations: GroupInvitation[];
  result_groupInvitation: string;
  // layout
  loadingStatus: string;
  requestErrors: RequestErrors;
}

const initialState: UserState = {
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
  createGroupError: "",
  loadingStatus: loadingStatusEnum.idle,
  requestErrors: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoadingStatus_user(state, action: PayloadAction<string>) {
      state.loadingStatus = action.payload;
    },
    setFriendsOnlineStatus(
      state,
      action: PayloadAction<{ friend_id: string; status: string }>
    ) {
      const { friend_id, status } = action.payload;
      state.friendsList[friend_id].onlineStatus = status;
    },
    setAddFriendRequests(state, action: PayloadAction<AddFriendRequest>) {
      state.addFriendRequests.push(action.payload);
    },
    clearAddFriendRequests(state, action: PayloadAction<number>) {
      state.addFriendRequests = state.addFriendRequests.filter(
        (value, index) => {
          return index !== action.payload;
        }
      );
    },

    setResult_addFriendRequest(state, action: PayloadAction<string>) {
      state.result_addFriendRequest = action.payload;
    },
    setResult_groupInvitation(state, action: PayloadAction<string>) {
      state.result_groupInvitation = action.payload;
    },
    setGroupInvitation(state, action: PayloadAction<GroupInvitation>) {
      state.groupInvitations.push(action.payload);
    },
    respondToGroupInvitation(state, action: PayloadAction<number>) {
      state.groupInvitations[action.payload].was_responded = true;
    },
    updateGroupsList(state, action: PayloadAction<Group[]>) {
      for (let group of action.payload) {
        state.groupsList[group.group_id] = group;
      }
    },
    leaveGroup(
      state,
      action: PayloadAction<{ group_id: string; was_kicked: boolean }>
    ) {
      state.groupsList[action.payload.group_id].was_kicked =
        action.payload.was_kicked;
      state.groupsList[action.payload.group_id].user_left = true;
      state.groupsList[action.payload.group_id].user_left_at =
        new Date().toString();
    },
    clearLeftMember(
      state,
      action: PayloadAction<{ group_id: string; member_user_id: string }>
    ) {
      const { group_id, member_user_id } = action.payload;
      state.groupsList[group_id].group_members = state.groupsList[
        group_id
      ].group_members?.filter((member) => {
        return member.user_id !== member_user_id;
      });
    },
    removeGroup(state, action: PayloadAction<{ group_id: string }>) {
      delete state.groupsList[action.payload.group_id];
    },
    setBlockFriend(
      state,
      action: PayloadAction<{
        friend_id: string;
        block: boolean;
        being_blocked: boolean;
      }>
    ) {
      const { friend_id, block, being_blocked } = action.payload;
      if (being_blocked) {
        state.friendsList[friend_id].friend_blocked_user = block;
        state.friendsList[friend_id].friend_blocked_user_at =
          new Date().toString();
      } else {
        state.friendsList[friend_id].user_blocked_friend = block;
        state.friendsList[friend_id].user_blocked_friend_at =
          new Date().toString();
      }
    },
    setUserOnlineStatus(state, action: PayloadAction<string>) {
      state.currentUser.onlineStatus = action.payload;
    },
    changeAvatar(state, action: PayloadAction<string>) {
      state.currentUser.avatar_url = action.payload;
    },
    clearRequestError(state, action: PayloadAction<string>) {
      const name = action.payload;
      if (name === "all") {
        state.requestErrors = {};
        return;
      }
      if (
        name === inputNames.password ||
        name === inputNames.confirm_password
      ) {
        state.requestErrors[inputNames.password] = "";
        state.requestErrors[inputNames.confirm_password] = "";
        return;
      }
      if (
        name === inputNames.new_password ||
        name === inputNames.confirm_new_password
      ) {
        state.requestErrors[inputNames.new_password] = "";
        state.requestErrors[inputNames.confirm_new_password] = "";
        return;
      }
      state.requestErrors[name] = "";
    },
    setIsLoggedIn(state, action: PayloadAction<boolean>) {
      state.currentUser.isLoggedIn = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      /***************  GET AUTH  ***************/
      .addCase(getUserAuth.fulfilled, (state, action): void => {
        if (!action.payload.currentUser.isLoggedIn) {
          state.currentUser = action.payload.currentUser;
          return;
        }
        const {
          currentUser,
          addFriendRequests,
          groupInvitations,
          groupsList,
          friendsList,
          require_initialize,
        } = action.payload;

        state.currentUser = currentUser;
        state.addFriendRequests = addFriendRequests;
        state.groupInvitations = groupInvitations;
        // map the groupsList into groupsList. It would be easier to put
        // the group_members in the respective group when user enters a group room
        for (let group of groupsList) {
          state.groupsList[group.group_id] = group;
          if (!group.user_left) {
            state.groupsToJoin.push(group.group_id);
          }
        }

        if (require_initialize) {
          state.currentUser.onlineStatus = onlineStatus_enum.online;
        }
        for (let friend of friendsList) {
          state.friendsList[friend.friend_id] = friend;
          if (require_initialize) {
            state.friendsList[friend.friend_id].onlineStatus =
              onlineStatus_enum.offline;
          }
        }
      })

      /***************  SIGN IN  ***************/
      .addCase(signIn.fulfilled, (state, action): void => {
        state.currentUser = action.payload.currentUser;
        state.currentUser.onlineStatus = onlineStatus_enum.online;
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
      })
      .addCase(signIn.pending, (state): void => {
        state.loadingStatus = loadingStatusEnum.loading;
      })
      .addCase(signIn.rejected, (state, action: PayloadAction<any>): void => {
        for (let err of action.payload.errors) {
          state.requestErrors[err.field] = err.message;
        }
        state.loadingStatus = loadingStatusEnum.failed;
      })

      /***************  SIGN UP  ***************/
      .addCase(
        signUp.fulfilled,
        (state, action: PayloadAction<CurrentUser>): void => {
          state.currentUser = action.payload;
          state.currentUser.onlineStatus = onlineStatus_enum.online;
          state.loadingStatus = loadingStatusEnum.idle;
        }
      )
      .addCase(signUp.pending, (state): void => {
        state.loadingStatus = loadingStatusEnum.loading;
      })
      .addCase(signUp.rejected, (state, action: PayloadAction<any>): void => {
        for (let err of action.payload.errors) {
          state.requestErrors[err.field] = err.message;
        }
        state.loadingStatus = loadingStatusEnum.failed;
      })

      /***************  SIGN OUT  ***************/
      .addCase(signOut.fulfilled, (state, action): void => {
        state.currentUser = { ...initialState.currentUser };
        state.loadingStatus = loadingStatusEnum.idle;
      })

      /***************  CREATE A NEW GROUP  ***************/
      .addCase(createNewGroup.fulfilled, (state, action): void => {
        state.groupsList[action.payload.group_id] = action.payload;
        state.loadingStatus = loadingStatusEnum.createNewGroup_succeeded;
        state.newGroupToJoin = action.payload.group_id;
      })
      .addCase(createNewGroup.pending, (state): void => {
        state.loadingStatus = loadingStatusEnum.createNewGroup_loading;
      })
      .addCase(
        createNewGroup.rejected,
        (state, action: PayloadAction<any>): void => {
          // each user can only create 5 groups (for demo)
          state.createGroupError = action.payload.errors[0].message;
          state.loadingStatus = loadingStatusEnum.failed;
        }
      )

      /***************  GET GROUP MEMBERS  ***************/
      .addCase(
        getGroupMembersList_database.fulfilled,
        (state, action): void => {
          const { group_id, group_members, wasMembersListLoaded } =
            action.payload;
          if (wasMembersListLoaded) return;

          state.groupsList[group_id].group_members = group_members;
          state.groupsList[group_id].wasMembersListLoaded = true;
          // state.loadingStatus = "succeeded";
        }
      )

      /***************  FORGOT PASSWORD REQUEST  ***************/
      .addCase(forgotPasswordRequest.fulfilled, (state, action): void => {
        state.loadingStatus = loadingStatusEnum.succeeded;
      })
      .addCase(forgotPasswordRequest.pending, (state): void => {
        state.loadingStatus = loadingStatusEnum.loading;
      })
      .addCase(
        forgotPasswordRequest.rejected,
        (state, action: PayloadAction<any>): void => {
          state.loadingStatus = loadingStatusEnum.failed;
          for (let err of action.payload.errors) {
            state.requestErrors[err.field] = err.message;
          }
        }
      )

      /***************  RESET PASSWORD  ***************/
      .addCase(forgotPasswordReset.fulfilled, (state): void => {
        state.loadingStatus = loadingStatusEnum.succeeded;
      })
      .addCase(forgotPasswordReset.pending, (state): void => {
        state.loadingStatus = loadingStatusEnum.loading;
      })
      .addCase(
        forgotPasswordReset.rejected,
        (state, action: PayloadAction<any>): void => {
          for (let err of action.payload.errors) {
            state.requestErrors[err.field] = err.message;
            if (err.field === "expired_link") {
              state.loadingStatus = loadingStatusEnum.time_out;
            }
          }
          if (state.loadingStatus !== loadingStatusEnum.time_out) {
            state.loadingStatus = loadingStatusEnum.failed;
          }
        }
      )

      /***************  CHANGE PASSWORD  ***************/
      .addCase(changePassword.fulfilled, (state): void => {
        state.loadingStatus = loadingStatusEnum.resetPW_succeeded;
      })
      .addCase(changePassword.pending, (state): void => {
        state.loadingStatus = loadingStatusEnum.resetPW_loading;
      })
      .addCase(
        changePassword.rejected,
        (state, action: PayloadAction<any>): void => {
          for (let err of action.payload.errors) {
            state.requestErrors[err.field] = err.message;
          }
          state.loadingStatus = loadingStatusEnum.resetPW_failed;
        }
      )

      /***************  CHANGE USERNAME  ***************/
      .addCase(changeUsername.fulfilled, (state, action): void => {
        state.currentUser.username = action.payload.username;
        state.loadingStatus = loadingStatusEnum.succeeded;
      })
      .addCase(changeUsername.pending, (state): void => {
        state.loadingStatus = loadingStatusEnum.loading;
      })
      .addCase(
        changeUsername.rejected,
        (state, action: PayloadAction<any>): void => {
          for (let err of action.payload.errors) {
            state.requestErrors[err.field] = err.message;
          }
        }
      );
  },
});

export const {
  setLoadingStatus_user,
  setFriendsOnlineStatus,
  setAddFriendRequests,
  clearAddFriendRequests,
  setResult_addFriendRequest,
  setResult_groupInvitation,
  setGroupInvitation,
  respondToGroupInvitation,
  updateGroupsList,
  leaveGroup,
  clearLeftMember,
  removeGroup,
  setBlockFriend,
  setUserOnlineStatus,
  changeAvatar,
  clearRequestError,
  setIsLoggedIn,
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

export const selectCreateGroupError = createSelector(
  [selectUser],
  (userState) => userState.createGroupError
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
