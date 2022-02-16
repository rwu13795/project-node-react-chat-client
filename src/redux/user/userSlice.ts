import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../index";
import { createNewGroup } from "./asyncThunk/create-new-group";
import { getUserAuth } from "./asyncThunk/get-user-auth";
import { signIn } from "./asyncThunk/sign-in";
import { signUp } from "./asyncThunk/sign-up";

interface UserInfo {}

export interface CurrentUser {
  username: string;
  email: string;
  user_id: string;
  isLoggedIn?: boolean;
}
export interface AuthErrors {
  [inputName: string]: string;
}
export interface AddFriendRequest {
  sender_id: string;
  sender_username: string;
  sender_email: string;
  message: string;
}

export interface Friend {
  friend_id: string;
  friend_username: string;
  friend_email: string;
}
export interface Group {
  group_id: string;
  group_name: string;
  creator_user_id: string;
  user_kicked: boolean;
}

export interface UserState {
  currentUser: CurrentUser;
  // friends
  friendsList: Friend[];
  friendsOnlineStatus: { [friend_id: string]: boolean };
  addFriendRequests: AddFriendRequest[];
  result_addFriendRequest: string;
  // groups
  groupsList: Group[];
  // layout
  loadingStatus: string;
  authErrors: AuthErrors;
}

const initialState: UserState = {
  currentUser: { username: "", email: "", user_id: "", isLoggedIn: false },
  friendsList: [],
  friendsOnlineStatus: {},
  addFriendRequests: [],
  result_addFriendRequest: "",
  groupsList: [],
  loadingStatus: "idle",
  authErrors: {},
};

//////////////
// SIGN OUT //
//////////////
// const signOut = createAsyncThunk("user/signOut", async () => {
//   await client.post(serverUrl + "/auth/sign-out");
//   return;
// });

/////////////////
// UPDATE INFO //
/////////////////
// const updateUserInfo = createAsyncThunk<
//   UserState,
//   { inputValues: InputValues },
//   { state: RootState }
// >("user/updateUserInfo", async ({ inputValues }, thunkAPI) => {
//   // compare the values before sending them to server, if nothing changes
//   // return an "no_change" authErrors to the "fullfilled"
//   let userInfo = thunkAPI.getState().user.currentUser.userInfo;
//   if (userInfo !== undefined) {
//     let noChange = true;
//     for (let [key, value] of Object.entries(userInfo)) {
//       if (value !== inputValues[key]) {
//         noChange = false;
//         break;
//       }
//     }
//     if (noChange) {
//       return { authErrors: { no_change: "no_change" } };
//     }
//   }

//   const response = await client.post(serverUrl + "/auth/update-info", {
//     update: inputValues,
//     csrfToken: thunkAPI.getState().user.csrfToken,
//     userId: thunkAPI.getState().user.currentUser.userId,
//   });
//   return response.data;
// });

////////////////////
// RESET PASSWORD //
////////////////////
// const resetPassword = createAsyncThunk<
//   void,
//   {
//     old_password: string;
//     new_password: string;
//     confirm_new_password: string;
//   },
//   { state: RootState }
// >("user/resetPassword", async (body, thunkAPI) => {
//   try {
//     const csrfToken = thunkAPI.getState().user.csrfToken;
//     await client.post(serverUrl + "/auth/reset-password", {
//       ...body,
//       csrfToken,
//     });
//   } catch (err: any) {
//     return thunkAPI.rejectWithValue(err.response.data);
//   }
// });

/////////////////////
// FORGOT PASSWORD //
/////////////////////
// const forgotPassword_Request = createAsyncThunk<
//   void,
//   string,
//   { state: RootState }
// >("user/forgotPassword_Request", async (email, thunkAPI) => {
//   try {
//     await client.post(serverUrl + "/auth/forgot-password-request", {
//       email,
//     });
//     return;
//   } catch (err: any) {
//     return thunkAPI.rejectWithValue(err.response.data);
//   }
// });

// const forgotPassword_Reset = createAsyncThunk<
//   void,
//   {
//     new_password: string;
//     confirm_new_password: string;
//     token: string;
//     userId: string;
//   },
//   { state: RootState }
// >("user/forgotPassword_Reset", async (body, thunkAPI) => {
//   try {
//     await client.post(serverUrl + "/auth/forgot-password-reset", {
//       ...body,
//     });
//     return;
//   } catch (err: any) {
//     return thunkAPI.rejectWithValue(err.response.data);
//   }
// });

////////////////////////////////////////////////////////////////////////////////

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    //   clearAuthErrors(state, action: PayloadAction<string>) {
    //     if (action.payload === "all") {
    //       state.authErrors = {};
    //     } else {
    //       state.authErrors[action.payload] = "";
    //     }
    //   },

    setLoadingStatus(state, action: PayloadAction<string>) {
      state.loadingStatus = action.payload;
    },
    setFriendsOnlineStatus(
      state,
      action: PayloadAction<{ friend_id: string; online: boolean }>
    ) {
      console.log("setting online status", action.payload);
      const { friend_id, online } = action.payload;
      state.friendsOnlineStatus[friend_id] = online;
    },
    setAddFriendRequests(state, action: PayloadAction<AddFriendRequest>) {
      state.addFriendRequests.push(action.payload);
    },
    setResult_addFriendRequest(state, action: PayloadAction<string>) {
      state.result_addFriendRequest = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      /***************  GET AUTH  ***************/
      .addCase(getUserAuth.fulfilled, (state, action): void => {
        // remember to add the state type as return type
        state.currentUser = action.payload.currentUser;
        state.friendsList = action.payload.friendsList;
        state.addFriendRequests = action.payload.addFriendRequests;
        if (action.payload.require_initialize) {
          for (let f of action.payload.friendsList) {
            state.friendsOnlineStatus[f.friend_id] = false;
          }
        }
      })

      /***************  SIGN IN  ***************/
      .addCase(
        signIn.fulfilled,
        (state, action: PayloadAction<UserState>): void => {
          state.currentUser = action.payload.currentUser;
          state.friendsList = action.payload.friendsList;
          state.addFriendRequests = action.payload.addFriendRequests;
          // initialize the friendsOnlineStatus
          for (let f of action.payload.friendsList) {
            state.friendsOnlineStatus[f.friend_id] = false;
          }
          state.loadingStatus = "succeeded";
        }
      )
      .addCase(signIn.pending, (state): void => {
        state.loadingStatus = "loading";
      })
      .addCase(signIn.rejected, (state, action: PayloadAction<any>): void => {
        for (let err of action.payload.errors) {
          state.authErrors[err.field] = err.message;
        }
        state.loadingStatus = "failed";
      })

      /***************  SIGN UP  ***************/
      .addCase(
        signUp.fulfilled,
        (state, action: PayloadAction<UserState>): void => {
          state.currentUser = action.payload.currentUser;
          state.loadingStatus = "succeeded";
        }
      )
      .addCase(signUp.pending, (state, action): void => {
        state.loadingStatus = "loading";
      })
      .addCase(signUp.rejected, (state, action: PayloadAction<any>): void => {
        for (let err of action.payload.errors) {
          state.authErrors[err.field] = err.message;
        }
        state.loadingStatus = "failed";
      })

      /***************  CREATE A NEW GROUP  ***************/
      .addCase(createNewGroup.fulfilled, (state, action): void => {
        state.groupsList.push(action.payload);
        state.loadingStatus = "succeeded";

        console.log("state.groupsList", state.groupsList);
      })
      .addCase(createNewGroup.pending, (state, action): void => {
        state.loadingStatus = "loading";
      });

    //////////////
    // SIGN OUT //
    //////////////
    // .addCase(signOut.fulfilled, (state, action): void => {
    //   state.currentUser.isLoggedIn = false;
    //   state.loadingStatus = "idle";
    // })

    ////////////////////
    // RESET PASSWORD //
    ////////////////////
    //   .addCase(resetPassword.fulfilled, (state, action): void => {
    //     state.loadingStatus = "reset_password_succeeded";
    //   })
    //   .addCase(resetPassword.pending, (state, action): void => {
    //     state.loadingStatus = "loading";
    //   })
    //   .addCase(
    //     resetPassword.rejected,
    //     (state, action: PayloadAction<any>): void => {
    //       for (let err of action.payload.errors) {
    //         state.authErrors[err.field] = err.message;
    //       }
    //       state.loadingStatus = loadingStatus.failed;
    //     }
    //   )
    ////////////////////
    // FORGOT PASSWORD //
    ////////////////////
    //   .addCase(forgotPassword_Request.fulfilled, (state): void => {
    //     state.loadingStatus = loadingStatus.succeeded;
    //   })
    //   .addCase(forgotPassword_Request.pending, (state): void => {
    //     state.loadingStatus = loadingStatus.loading;
    //   })
    //   .addCase(
    //     forgotPassword_Request.rejected,
    //     (state, action: PayloadAction<any>): void => {
    //       state.loadingStatus = loadingStatus.failed;
    //       for (let err of action.payload.errors) {
    //         state.authErrors[err.field] = err.message;
    //       }
    //     }
    //   )
    //   .addCase(forgotPassword_Reset.fulfilled, (state): void => {
    //     state.loadingStatus = loadingStatus.succeeded;
    //   })
    //   .addCase(forgotPassword_Reset.pending, (state): void => {
    //     state.loadingStatus = loadingStatus.loading;
    //   })
    //   .addCase(
    //     forgotPassword_Reset.rejected,
    //     (state, action: PayloadAction<any>): void => {
    //       for (let err of action.payload.errors) {
    //         state.authErrors[err.field] = err.message;
    //         if (err.field === "expired-link") {
    //           state.loadingStatus = loadingStatus.time_out;
    //         }
    //       }
    //       if (state.loadingStatus !== loadingStatus.time_out) {
    //         state.loadingStatus = loadingStatus.failed;
    //       }
    //     }
    //   );
  },
});

export const {
  //   clearAuthErrors,
  setLoadingStatus,
  setFriendsOnlineStatus,
  setAddFriendRequests,
  setResult_addFriendRequest,
  //   setPageLoading_user,
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
export const selectFriendsOnlineStatus = createSelector(
  [selectUser],
  (userState) => userState.friendsOnlineStatus
);
export const selectAddFriendRequests = createSelector(
  [selectUser],
  (userState) => userState.addFriendRequests
);
export const selectAuthErrors = createSelector(
  [selectUser],
  (userState) => userState.authErrors
);
export const selectResult_addFriendRequest = createSelector(
  [selectUser],
  (userState) => userState.result_addFriendRequest
);
