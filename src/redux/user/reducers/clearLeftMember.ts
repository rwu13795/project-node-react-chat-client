import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { UserState } from "../userSlice";

export function clearLeftMember_reducer(
  state: WritableDraft<UserState>,
  action: PayloadAction<{ group_id: string; member_user_id: string }>
) {
  const { group_id, member_user_id } = action.payload;
  state.groupsList[group_id].group_members = state.groupsList[
    group_id
  ].group_members?.filter((member) => {
    return member.user_id !== member_user_id;
  });
}
