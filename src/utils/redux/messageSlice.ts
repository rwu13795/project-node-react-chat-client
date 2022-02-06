import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "./index";

import axios_client from "../axios-client";

interface ChatHistory {
  sender_id: string;
  receiver_id: string;
  body: string;
  created_at: string;
}
interface FriendChatHistory {
  [friend_id: string]: ChatHistory[];
}
interface GroupChatHistory {
  [group_id: string]: ChatHistory[];
}

interface MessageState {
  currentMessageRecipient: string;
  friendChatHistory: FriendChatHistory;
  groupChatHistory: GroupChatHistory;
}

const initialState: MessageState = {
  currentMessageRecipient: "",
  friendChatHistory: {},
  groupChatHistory: {},
};

const client = axios_client();
//   const serverUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}`;
const serverUrl = "http://localhost:5000/api";

//////////////
// SIGN IN  //
//////////////
//   const signIn = createAsyncThunk<UserState, SignInBody, { state: RootState }>(
//     "user/signIn",
//     async (
//       signInBody,
//       // NOTE//
//       // if you need to customize the contents of the rejected action, you should
//       // catch any errors yourself, and then return a new value using the
//       // thunkAPI.rejectWithValue
//       thunkAPI
//     ) => {
//       try {
//         const response = await client.post(serverUrl + "/auth/sign-in", {
//           req_email: signInBody.email,
//           req_password: signInBody.password,
//         });
//         return response.data;
//       } catch (err: any) {
//         // catch the error sent from the server manually, and put it in inside the action.payload
//         return thunkAPI.rejectWithValue(err.response.data);
//       }
//     }
//   );

////////////////////////////////////////////////////////////////////////////////

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    //   clearAuthErrors(state, action: PayloadAction<string>) {
    //     if (action.payload === "all") {
    //       state.authErrors = {};
    //     } else {
    //       state.authErrors[action.payload] = "";
    //     }
    //   },

    setCurrentMessageRecipient(state, action: PayloadAction<string>) {
      state.currentMessageRecipient = action.payload;
    },
    setFriendChatHistory(
      state,
      action: PayloadAction<ChatHistory & { currentUserId?: string }>
    ) {
      const { sender_id, receiver_id, body, created_at, currentUserId } =
        action.payload;

      // the current user is the receiver
      let friend_id = sender_id;
      // the current user is the sender
      if (sender_id === currentUserId) {
        friend_id = receiver_id;
      }
      if (!state.friendChatHistory[friend_id]) {
        state.friendChatHistory[friend_id] = [];
      }

      state.friendChatHistory[friend_id].push({
        sender_id,
        receiver_id,
        body,
        created_at,
      });
    },
  },
  // extraReducers: (builder) => {
  //   builder

  // .addCase(
  //   signIn.fulfilled,
  //   (state, action: PayloadAction<UserState>): void => {
  //     state.currentUser = action.payload.currentUser;
  //     state.friendsList = action.payload.friendsList;
  //     state.loadingStatus = "succeeded";
  //   }
  // )
  // .addCase(signIn.pending, (state): void => {
  //   state.loadingStatus = "loading";
  // })
  // .addCase(signIn.rejected, (state, action: PayloadAction<any>): void => {
  //   for (let err of action.payload.errors) {
  //     state.authErrors[err.field] = err.message;
  //   }
  //   state.loadingStatus = "failed";
  //   // state.pageLoading_user = false;
  // })
  //////////////
  // SIGN OUT //
  //////////////
});

export const { setCurrentMessageRecipient, setFriendChatHistory } =
  messageSlice.actions;

export {};

export default messageSlice.reducer;

// NOTE from Redux Docs //
// In typical Reselect usage, you write your top-level "input selectors" as plain functions,
// and use createSelector to create memoized selectors that look up nested value
const selectMessageState = (state: RootState) => state.message;
export const selectCurrentMessageRecipient = createSelector(
  [selectMessageState],
  (messageState) => messageState.currentMessageRecipient
);
export const selectFriendChatHistory = createSelector(
  [selectMessageState],
  (messageState) => {
    return messageState.friendChatHistory[messageState.currentMessageRecipient]
      ? messageState.friendChatHistory[messageState.currentMessageRecipient]
      : [];
  }
);
