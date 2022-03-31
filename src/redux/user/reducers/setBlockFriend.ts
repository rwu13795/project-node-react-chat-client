import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { UserState } from "../userSlice";

export function setBlockFriend_reducer(
  state: WritableDraft<UserState>,
  action: PayloadAction<{
    friend_id: string;
    block: boolean;
    being_blocked: boolean;
  }>
) {
  const { friend_id, block, being_blocked } = action.payload;
  if (being_blocked) {
    state.friendsList[friend_id].friend_blocked_user = block;
    state.friendsList[friend_id].friend_blocked_user_at = new Date().toString();
  } else {
    state.friendsList[friend_id].user_blocked_friend = block;
    state.friendsList[friend_id].user_blocked_friend_at = new Date().toString();
  }
}
