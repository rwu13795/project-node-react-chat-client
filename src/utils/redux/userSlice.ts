import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "./index";

import axios_client from "../axios-client";

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

interface SignUpBody {
  email: string;
  password: string;
  confirm_password: string;
  userInfo: UserInfo;
}
interface SignInBody {
  email: string;
  password: string;
}

interface Friends {
  friend_id: string;
  friend_username: string;
  friend_email: string;
}

interface UserState {
  currentUser: CurrentUser;
  friendsList: Friends[];
  loadingStatus: string;
  authErrors: AuthErrors;

  // pageLoading_user: boolean;
}

const initialState: UserState = {
  currentUser: { username: "", email: "", user_id: "", isLoggedIn: false },
  friendsList: [],
  loadingStatus: "idle",
  authErrors: {},
};

const client = axios_client();
//   const serverUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}`;
const serverUrl = "http://localhost:5000/api";

//////////////
// GET AUTH //
//////////////
const getUserStatus = createAsyncThunk("user/getUserStatus", async () => {
  const response = await client.get(serverUrl + "/auth/user-auth-status");
  return response.data;
});

//////////////
// SIGN IN  //
//////////////
/*  createAsyncThunk types
    1) UserState -- action payload types for the "signIn.fullfilled" and other signIn.xxxxx
       I don't need to put the type in the Payload<> if I have indicate the type here
    
    2) types of object which is being passed into the dispatch function
    3) { state: RootState } the thunkAPI type
*/

const signIn = createAsyncThunk<UserState, SignInBody, { state: RootState }>(
  "user/signIn",
  async (
    signInBody,
    // NOTE//
    // if you need to customize the contents of the rejected action, you should
    // catch any errors yourself, and then return a new value using the
    // thunkAPI.rejectWithValue
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

//////////////
// SIGN OUT //
//////////////
const signOut = createAsyncThunk("user/signOut", async () => {
  await client.post(serverUrl + "/auth/sign-out");
  return;
});

/////////////
// SIGN UP //
/////////////
const signUp = createAsyncThunk<UserState, SignUpBody, { state: RootState }>(
  "user/signUp",
  async (signUpBody, thunkAPI) => {
    try {
      const response = await client.post(serverUrl + "/auth/sign-up", {
        email: signUpBody.email,
        password: signUpBody.password,
        confirm_password: signUpBody.confirm_password,
        userInfo: signUpBody.userInfo,
      });
      return response.data;
    } catch (err: any) {
      // catch the error sent from the server manually, and put it in inside the action.payload
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

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
  },
  extraReducers: (builder) => {
    builder
      //////////////
      // GET AUTH //
      //////////////
      .addCase(
        getUserStatus.fulfilled,
        (state, action: PayloadAction<UserState>): void => {
          // remember to add the state type as return type
          state.currentUser = action.payload.currentUser;
          state.friendsList = action.payload.friendsList;
        }
      )
      /////////////
      // SIGN IN //
      /////////////
      .addCase(
        signIn.fulfilled,
        (state, action: PayloadAction<UserState>): void => {
          state.currentUser = action.payload.currentUser;
          state.friendsList = action.payload.friendsList;
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
        // state.pageLoading_user = false;
      })
      //////////////
      // SIGN OUT //
      //////////////
      .addCase(signOut.fulfilled, (state, action): void => {
        state.currentUser.isLoggedIn = false;
        state.loadingStatus = "idle";
      })
      /////////////
      // SIGN UP //
      /////////////
      .addCase(
        signUp.fulfilled,
        (state, action: PayloadAction<UserState>): void => {
          state.currentUser = action.payload.currentUser;
          state.loadingStatus = "succeeded";
          //   state.pageLoading_user = false;
        }
      )
      .addCase(signUp.pending, (state, action): void => {
        state.loadingStatus = "loading";
        // state.pageLoading_user = true;
      })
      .addCase(signUp.rejected, (state, action: PayloadAction<any>): void => {
        for (let err of action.payload.errors) {
          state.authErrors[err.field] = err.message;
        }
        state.loadingStatus = "failed";
        // state.pageLoading_user = false;
      });

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

  //   setPageLoading_user,
} = userSlice.actions;

export {
  signIn,
  signOut,
  signUp,
  getUserStatus,

  //   updateUserInfo,

  //   resetPassword,
  //   forgotPassword_Request,
  //   forgotPassword_Reset,
};

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
