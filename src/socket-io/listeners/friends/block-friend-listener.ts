import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

import { setBlockFriend } from "../../../redux/user/userSlice";

interface Data {
  blocked_by: string;
  block: boolean;
}

export function blockFriend_listener(socket: Socket, dispatch: Dispatch<any>) {
  socket.on("block-friend", ({ blocked_by, block }: Data) => {
    // if block is true, that means the current user is being blocked by
    // one of the friends. Otherwise, the user is being un-blocked
    if (block) {
      console.log(`user ${blocked_by} has blocked you!`);
    } else {
      console.log(`user ${blocked_by} just un-blocked you!`);
    }

    dispatch(
      setBlockFriend({ friend_id: blocked_by, block, being_blocked: true })
    );
  });
}
