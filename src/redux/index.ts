import { configureStore } from "@reduxjs/toolkit";

import messageSlice from "./message/messageSlice";
import userSlice from "./user/userSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    message: messageSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
