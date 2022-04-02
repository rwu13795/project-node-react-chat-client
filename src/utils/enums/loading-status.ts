export enum loadingStatusEnum {
  idle = "idle",
  failed = "failed",
  succeeded = "succeeded",
  loading = "loading",
  time_out = "time_out",

  createNewGroup_succeeded = "createNewGroup_succeeded",
  createNewGroup_loading = "createNewGroup_loading",
  createNewGroup_failed = "createNewGroup_failed",

  resetPW_succeeded = "resetPW_succeeded",
  resetPW_loading = "resetPW_loading",
  resetPW_failed = "resetPW_failed",

  changingTargetRoom = "changingTargetRoom",

  joiningNewGroup_loading = "joiningNewGroup_loading",

  addFriend_loading = "addFriend_loading",
  addFriend_succeeded = "addFriend_succeeded",

  addFriendRequest_loading = "addFriendRequest_loading",
  addFriendRequest_succeeded = "addFriendRequest_succeeded",

  getNotifications_succeeded = "getNotifications_succeeded",

  signOut_succeeded = "signOut_succeeded",

  googleSignIn_loading = "googleSignIn_loading",
}
