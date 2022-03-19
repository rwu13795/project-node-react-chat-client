import { Socket } from "socket.io-client";
import { chatType } from "../../../redux/message/messageSlice";

interface Body {
  user_id: string;
  group_ids: string[];
}

export function joinRoom_emitter(socket: Socket, { user_id, group_ids }: Body) {
  socket.emit("join-room", {
    private_id: `${chatType.private}_${user_id}`,
    group_ids,
  });
}
