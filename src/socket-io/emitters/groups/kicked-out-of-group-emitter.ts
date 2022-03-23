import { DataObject } from "@mui/icons-material";
import { Socket } from "socket.io-client";

export function kickedOutOfGroup_emitter(
  socket: Socket,
  data: {
    group_id: string;
  }
) {
  socket.emit("kicked-out-of-group", data);
}
