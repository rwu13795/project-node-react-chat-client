import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { Group, UserState } from "../userSlice";

export function updateGroupsList_reducer(
  state: WritableDraft<UserState>,
  action: PayloadAction<Group[]>
) {
  for (let group of action.payload) {
    state.groupsList[group.group_id] = group;
  }
}
