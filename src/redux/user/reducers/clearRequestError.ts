import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { inputNames } from "../../../utils";
import { UserState } from "../userSlice";

export function clearRequestError_reducer(
  state: WritableDraft<UserState>,
  action: PayloadAction<string>
) {
  const name = action.payload;
  if (name === "all") {
    state.requestErrors = {};
    return;
  }
  if (name === inputNames.password || name === inputNames.confirm_password) {
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
}
