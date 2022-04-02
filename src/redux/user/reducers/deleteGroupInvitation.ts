import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { UserState } from "../userSlice";

export function deleteGroupInvitation_reducer(
  state: WritableDraft<UserState>,
  action: PayloadAction<string>
) {
  const group_id = action.payload;

  console.log("group_id in delete", group_id);

  state.groupInvitations = state.groupInvitations.filter((group) => {
    return group.group_id !== group_id;
  });

  console.log("groupInvitations", [...state.groupInvitations]);
}
